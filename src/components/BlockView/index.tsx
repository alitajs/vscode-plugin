import React, { useState, useEffect } from 'react';
import { Layout, Menu, Empty } from 'antd';
import { Modal } from 'antd-mobile';
// @ts-ignore
import { useRequest } from 'alita';
import TemplateList from '@/components/TemplateList';
import { BlockConfig } from '../../../shared/typings';
import vscBridge from '@vscbridge/webview';

const BlockView = () => {
  const [siderMenus, setSiderMenus] = useState<Array<BlockConfig>>([]);
  const [currentSiderMenu, setCurrentSideMenu] = useState(siderMenus[0]?.key);
  const [snapshotUriPrefix, setSnapshotUriPrefix] = useState('');

  const { data } = useRequest(
    () => {
      return vscBridge.callHandler(
        'getBlockTemplatesJSON',
        siderMenus.find((item) => item.key === currentSiderMenu)
      );
    },
    {
      refreshDeps: [currentSiderMenu],
      ready: !!currentSiderMenu
    }
  );

  useEffect(() => {
    vscBridge.callHandler('getBlockConfig', {}).then((res: any) => {
      setSiderMenus(res);
      setCurrentSideMenu(res[0]?.key);
    });
  }, []);

  useEffect(() => {
    if (!currentSiderMenu) {
      return;
    }
    vscBridge
      .callHandler(
        'getBlockSnapshotUriPrefix',
        siderMenus.find((item) => item.key === currentSiderMenu)
      )
      .then((uri) => setSnapshotUriPrefix(uri as string));
  }, [currentSiderMenu]);

  const handleSiderMenuClick = (info: any) => {
    setCurrentSideMenu(info.key);
  };

  const onItemCLick = (item: any) => {
    vscBridge.callHandlerNoCallback('templateSelected', { tpl: item });
  };

  const onDownloadCLick = (item: any) => {
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
                    blockKey: currentSiderMenu,
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
    return <Empty>请配置区块数据</Empty>;
  }

  return (
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
            snapshotUriPrefix={snapshotUriPrefix}
            data={data}
            onItemClick={onItemCLick}
            onDownloadClick={onDownloadCLick}
          />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default BlockView;
