import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Modal } from 'antd-mobile';
// @ts-ignore
import { useRequest } from 'alita';
import TemplateList from '@/components/TemplateList';
import { queryAlipayTpl } from '@/services/tplService';
import vscode from '@/utils/vscode';

const BLOCK_SIDER_MENU_DATA = [
  {
    title: '支付宝',
    key: 'alipay',
  },
  {
    title: '火麒麟政企',
    key: 'kirin',
  },
  {
    title: '智慧装维',
    key: 'smartInstallAndMaintain',
  },
];

const apiLookup = {
  alipay: queryAlipayTpl,
  kirin: () => new Promise((resolve) => resolve({})),
  smartInstallAndMaintain: () => new Promise((resolve) => resolve({})),
};

const BlockView = () => {
  const siderMenus = BLOCK_SIDER_MENU_DATA;
  const [currentSiderMenu, setCurrentSideMenu] = useState(siderMenus[0].key);

  const { data } = useRequest(
    () => {
      return apiLookup[currentSiderMenu]?.();
    },
    {
      refreshDeps: [currentSiderMenu],
    }
  );

  const handleSiderMenuClick = (info: any) => {
    setCurrentSideMenu(info.key);
  };

  const onItemCLick = (item: any) => {
    vscode?.postMessage?.({
      type: 'templateSelected',
      value: item,
    });
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
                  vscode?.postMessage?.({
                    type: 'templateDownload',
                    value: item,
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
