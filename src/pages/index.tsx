import React, { FC } from 'react';
import { Accordion, Modal, Flex } from 'antd-mobile';
// @ts-ignore
import { useRequest } from 'alita';
import { query } from './service';

import styles from './index.less';

interface PageProps { }

const AbcPage: FC<PageProps> = () => {
  const { data } = useRequest(query);

  const onItemCLick = (item: any) => {
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
                text: '提交', onPress: text => {
                  const vscode = (window as any).acquireVsCodeApi();
                  vscode.postMessage({ type: 'templatesSelected', value: item.key });
                }
              },
            ],
            'default',
          )
        },
      },
    ])

  }
  const renderList = (listData: any) => {
    if (!listData) return <></>;
    return (<Accordion defaultActiveKey="0" className={styles.tplType} >
      {Object.keys(listData).map(item => <Accordion.Panel header={item} >
        <Accordion defaultActiveKey="0" accordion className={styles.tplSubType}>
          {Object.keys(listData[item]).map(subItem => <Accordion.Panel header={subItem}>
            <Flex direction="row" wrap="wrap" justify="start" align="center">
              {listData[item][subItem].map((i: any) => <div className={styles.flexItem} onClick={() => onItemCLick(i)}><p className={styles.description}>{i.description}</p><div className={styles.imgPanel}><img src={i.img} /></div></div>
              )}
            </Flex>
          </Accordion.Panel>)}
        </Accordion>
      </Accordion.Panel>)
      }
    </Accordion>)

  }
  return (
    <div className={styles.center}>
      {data && renderList(data)}
    </div>
  );
};

export default AbcPage;
