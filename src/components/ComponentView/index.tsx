import React, { useState, useMemo } from 'react';
import { Layout, Menu } from 'antd';
// @ts-ignore
import { useRequest } from 'alita';
import { getAntdMobilePlusRoutes } from '@/services/tplService';
import styles from './index.less';
import vscBridge from '@vscbridge/webview';
import SearchView from '../SearchView';
import useSearch from './useSearch';
import SearchResultView from './SearchResultView';

const ComponentView = () => {
  const siderMenus: any[] = [
    {
      title: '基础组件',
      key: 'basic',
    },
    {
      title: '业务组件',
      key: 'plus',
    },
  ];
  const [currentSiderMenu, setCurrentSiderMenu] = useState<string>(
    siderMenus[0].key
  );
  const { data: routesData } = useRequest(getAntdMobilePlusRoutes, {
    formatResult: (result: any) => result,
  });
  const { isSearch, handleSearch, searchResult } = useSearch({ routesData: routesData?.routes });

  const data = useMemo(() => {
    const routes = routesData?.routes;
    if (!Array.isArray(routes)) {
      return [];
    }

    return routes.filter((item) =>
      item.path?.startsWith(`/components/${currentSiderMenu}/`)
    );
  }, [routesData, currentSiderMenu]);

  const handleSiderMenuClick = (info: any) => {
    setCurrentSiderMenu(info.key);
  };

  const handleComponentClick = (component: any) => {
    vscBridge.callHandlerNoCallback('componentSelected', { component });
  };

  return (
    <Layout>
      <Layout.Header style={{ background: 'white' }}>
        <SearchView handleSearch={handleSearch} />
      </Layout.Header>
      {isSearch ? (
        <Layout.Content>
          <SearchResultView
            data={searchResult}
            onComponentClick={handleComponentClick}
          />
        </Layout.Content>
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
            <Layout.Content className={styles.componentsList}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyItems: 'start',
                  alignItems: 'center',
                }}
              >
                {data.map((item) => {
                  return (
                    <div className={styles.flexItem} key={item.path}>
                      <p className={styles.description}>{item.title}</p>
                      <div
                        className={styles.imgPanel}
                        onClick={() => handleComponentClick(item)}
                      >
                        <img
                          src={`https://raw.githubusercontent.com/alitajs/antd-mobile-plus/master/screenshot/${item.meta?.componentName?.toLocaleLowerCase?.()}-demo.png?raw=true`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Layout.Content>
          </Layout>
        </Layout>
      )}
    </Layout>
  );
};

export default ComponentView;
