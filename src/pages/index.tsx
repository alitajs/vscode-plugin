import React, { FC, useState } from 'react';
import { Modal } from 'antd-mobile';
import { Layout, Menu } from 'antd';
// @ts-ignore
import { useRequest } from 'alita';
import vscode from '@/utils/vscode';
import { query } from './service';

import styles from './index.less';
import TemplateList from '@/components/TemplateList';

const MENU_DATA = [
  {
    title: '区块',
    key: 'block',
  },
  {
    title: '组件',
    key: 'component',
  },
];

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

const siderMenuLookUp = {
  block: BLOCK_SIDER_MENU_DATA,
  component: [],
};

interface PageProps {}

const IndexPage: FC<PageProps> = () => {
  const { data } = useRequest(query);
  const [currentMenu, setCurrentMenu] = useState('block');
  const [currentSiderMenu, setCurrentSideMenu] = useState(
    siderMenuLookUp[currentMenu][0]?.key
  );

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

  const handleMenuClick = (info: any) => {
    setCurrentMenu(info.key);
  };

  const handleSiderMenuClick = (info: any) => {
    setCurrentSideMenu(info.key);
  };

  const renderList = (listData: any) => {
    return (
      <Layout>
        <Layout.Header
          className="header"
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <Menu
            mode="horizontal"
            selectedKeys={[currentMenu]}
            onClick={handleMenuClick}
          >
            {MENU_DATA.map((menu) => {
              return <Menu.Item key={menu.key}>{menu.title}</Menu.Item>;
            })}
          </Menu>
        </Layout.Header>
        <Layout>
          <Layout.Sider width={112}>
            <Menu
              mode="vertical"
              selectedKeys={[currentSiderMenu]}
              onClick={handleSiderMenuClick}
            >
              {siderMenuLookUp[currentMenu].map((menu: any) => {
                return <Menu.Item key={menu.key}>{menu.title}</Menu.Item>;
              })}
            </Menu>
          </Layout.Sider>
          <Layout>
            <Layout.Content>
              <TemplateList
                data={listData}
                onItemClick={onItemCLick}
                onDownloadClick={onDownloadCLick}
              />
            </Layout.Content>
          </Layout>
        </Layout>
      </Layout>
    );
  };
  return <div className={styles.center}>{data && renderList(data)}</div>;
};

export default IndexPage;
