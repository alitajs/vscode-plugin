import React, { FC } from 'react';
import { Collapse } from 'antd';
import styles from './index.less';

interface PageProps {
  data: any;
  onItemClick?: (tpl: any) => void;
  onDownloadClick?: (tpl: any) => void;
}

const TemplateList: FC<PageProps> = ({
  data = {},
  onItemClick,
  onDownloadClick,
}) => {
  return (
    <Collapse>
      {Object.keys(data).map((item) => {
        return (
          <Collapse.Panel
            className={styles.templateList}
            header={item}
            key={item}
          >
            {
              <Collapse>
                {Object.keys(data[item]).map((subItem) => {
                  return (
                    <Collapse.Panel header={subItem} key={subItem}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          justifyItems: 'start',
                          alignItems: 'center',
                        }}
                      >
                        {data[item][subItem].map((tpl: any) => {
                          return (
                            <div
                              className={styles.flexItem}
                              onClick={(tpl) => onItemClick?.(tpl)}
                            >
                              <p className={styles.description}>
                                {tpl.description}
                              </p>
                              <div className={styles.imgPanel}>
                                <img src={tpl.img} />
                                <button
                                  className={styles.downloadBtn}
                                  onClick={() => onDownloadClick?.(tpl)}
                                >
                                  下载
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Collapse.Panel>
                  );
                })}
              </Collapse>
            }
          </Collapse.Panel>
        );
      })}
    </Collapse>
  );
};

export default TemplateList;
