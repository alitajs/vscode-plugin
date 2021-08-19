import React, { FC, useState } from 'react';
import { Layout, Menu } from 'antd';
// @ts-ignore
import { useRequest } from 'alita';
import BlockView from '@/components/BlockView';
import ComponentView from '@/components/ComponentView';

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

interface PageProps {}

const IndexPage: FC<PageProps> = () => {
  const [currentMenu, setCurrentMenu] = useState('block');

  const handleMenuClick = (info: any) => {
    setCurrentMenu(info.key);
  };

  return (
    <Layout>
      <Layout.Header style={{ paddingLeft: 0, paddingRight: 0 }}>
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
      {currentMenu === 'block' && <BlockView />}
      {currentMenu === 'component' && <ComponentView />}
    </Layout>
  );
};

export default IndexPage;
