import React from 'react';
import styles from './SearchResultView.less';

interface SearchResultViewProps {
  data?: any[];
  onComponentClick: (item: any) => void;
}

const SearchResultView = ({
  data,
  onComponentClick,
}: SearchResultViewProps) => {
  return (
    <div className={styles.resultView}>
      {data?.map((item) => {
        return (
          <div className={styles.flexItem} key={item.path}>
            <p className={styles.description}>{item.title}</p>
            <div
              className={styles.imgPanel}
              onClick={() => onComponentClick(item)}
            >
              <img
                src={`https://raw.githubusercontent.com/alitajs/antd-mobile-plus/master/screenshot/${item.meta?.componentName?.toLocaleLowerCase?.()}-demo.png?raw=true`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SearchResultView;
