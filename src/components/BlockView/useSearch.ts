import { useState, useEffect } from 'react';
import vscBridge from '@vscbridge/webview';
import { BlockConfig } from 'shared/typings';

const useSearch = ({ siderMenus }: { siderMenus: Array<BlockConfig> }) => {
  const [blockLookup, setBlockLookup] = useState<any>();
  const [searchResult, setSearchResult] = useState<any>();
  const [isSearch, setIsSearch] = useState(false);

  const fetchBlocks = async (menus: Array<BlockConfig>) => {
    const lookup = {};
    for (let i = 0; i < menus.length; i += 1) {
      const menu = menus[i];
      const config: any = await vscBridge.callHandler(
        'getBlockTemplatesJSON',
        menu
      );
      lookup[menu.key] = config?.data || {};
    }
    setBlockLookup(lookup);
  };
  useEffect(() => {
    if (!Array.isArray(siderMenus)) {
      return;
    }
    fetchBlocks(siderMenus);
  }, [siderMenus]);

  const handleSearch = (text: string) => {
    if (!text) {
      setIsSearch(false);
      setSearchResult([]);
      return;
    }
    setIsSearch(true);
    const result: any[] = [];
    const traversal = (obj: any, blockKey?: string) => {
      Object.keys(obj).forEach((key: string) => {
        if (Array.isArray(obj[key])) {
          const targets = obj[key].filter((item: any) => {
            return (
              item.name.indexOf(text) !== -1 ||
              item.description.indexOf(text) !== -1
            );
          }).map((item: any) => ({...item, blockKey,}));
          result.push(...targets);
        } else if (typeof obj[key] === 'object' && !!obj[key]) {
          traversal(obj[key], blockKey !== undefined ? blockKey : key);
        }
      });
    };
    traversal(blockLookup);
    setSearchResult(result);
  };

  return { isSearch, handleSearch, searchResult };
};

export default useSearch;
