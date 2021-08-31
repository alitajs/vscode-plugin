import React from 'react';
import { Empty } from 'antd';
import styles from './SearchResultView.less';

interface SearchResult {
  data: any[];
  onItemClick?: (tpl: any) => void;
  onDownloadClick?: (tpl: any) => void;
}

const SearchResultView = ({
  data,
  onItemClick,
  onDownloadClick,
}: SearchResult) => {
  if (Array.isArray(data) && data.length === 0) {
    return <Empty style={{ marginTop: 40 }} description="找不到相关内容" />;
  }
  return (
    <div
      className={styles.searchResult}
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyItems: 'start',
        alignItems: 'center',
      }}
    >
      {data.map((tpl) => {
        return (
          <div className={styles.flexItem} key={`${tpl?.blockKey}-${tpl?.key}`}>
            <p className={styles.description}>{tpl.description}</p>
            <div className={styles.imgPanel} onClick={() => onItemClick?.(tpl)}>
              <img src={tpl.snapshot} />
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
  );
};

export default SearchResultView;
