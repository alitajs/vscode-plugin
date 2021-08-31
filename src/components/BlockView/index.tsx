import React, { useState, useEffect } from 'react';
import { Layout, Menu, Empty, Input } from 'antd';
import { Modal } from 'antd-mobile';
// @ts-ignore
import { useRequest } from 'alita';
import TemplateList from '@/components/TemplateList';
import { BlockConfig } from '../../../shared/typings';
import vscBridge from '@vscbridge/webview';
import useSearch from './useSearch';
import SearchResultView from './SearchResultView';

const BlockView = () => {
  const [siderMenus, setSiderMenus] = useState<Array<BlockConfig>>([]);
  const [currentSiderMenu, setCurrentSideMenu] = useState(siderMenus[0]?.key);
  const { isSearch, handleSearch, searchResult } = useSearch({ siderMenus });

  const { data } = useRequest(
    () => {
      return vscBridge.callHandler(
        'getBlockTemplatesJSON',
        siderMenus.find((item) => item.key === currentSiderMenu)
      );
    },
    {
      refreshDeps: [currentSiderMenu],
      ready: !!currentSiderMenu,
    }
  );

  useEffect(() => {
    vscBridge.callHandler('getBlockConfig', {}).then((res: any) => {
      setSiderMenus(res);
      setCurrentSideMenu(res[0]?.key);
    });
  }, []);

  const handleSiderMenuClick = (info: any) => {
    setCurrentSideMenu(info.key);
  };

  const onItemCLick = (item: any) => {
    vscBridge.callHandlerNoCallback('templateSelected', { tpl: item });
  };

  const onDownloadCLick = (item: any, blockKey: string) => {
    Modal.alert('确认', `将<${item.title || item.description}>添加到项目中`, [
      { text: '取消', onPress: () => console.log('cancel') },
      {
        text: '确定',
        onPress: () => {
          Modal.prompt(
            '确认',
            '请输入新增路由的名称（请使用英文）',
            [
              { text: '取消' },
              {
                text: '提交',
                onPress: (text) => {
                  vscBridge.callHandlerNoCallback('templateDownload', {
                    blockKey,
                    pkgItem: item,
                    routerName: text,
                  });
                },
              },
            ],
            'default'
          );
        },
      },
    ]);
  };

  if (!siderMenus || siderMenus.length === 0) {
    return (
      <Empty style={{ marginTop: 40 }} description="请配置区块数据"></Empty>
    );
  }

  return (
    <Layout>
      <Layout.Header style={{ background: 'white' }}>
        <Input.Search
          style={{ width: '100%', verticalAlign: 'middle' }}
          size="large"
          placeholder="请输入"
          enterButton
          allowClear
          onSearch={handleSearch}
        />
      </Layout.Header>
      {isSearch ? (
        <SearchResultView
          data={searchResult}
          onItemClick={onItemCLick}
          onDownloadClick={(tpl) => onDownloadCLick(tpl, tpl.blockKey)}
        />
      ) : (
        <Layout>
          <Layout.Sider width={112}>
            <Menu
              mode="vertical"
              selectedKeys={[currentSiderMenu]}
              onClick={handleSiderMenuClick}
            >
              {siderMenus.map((menu: any) => {
                return <Menu.Item key={menu.key}>{menu.title}</Menu.Item>;
              })}
            </Menu>
          </Layout.Sider>
          <Layout>
            <Layout.Content>
              <TemplateList
                data={data}
                onItemClick={onItemCLick}
                onDownloadClick={(tpl) =>
                  onDownloadCLick(tpl, currentSiderMenu)
                }
              />
            </Layout.Content>
          </Layout>
        </Layout>
      )}
    </Layout>
  );
};

export default BlockView;
