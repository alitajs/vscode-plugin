import { useState } from 'react';

const useSearch = ({ routesData = [] }) => {
  const [isSearch, setIsSearch] = useState(false);
  const [searchResult, setSearchResult] = useState<any[]>();

  const handleSearch = (searchText: string) => {
    if (!searchText) {
      setIsSearch(false);
      setSearchResult([]);
      return;
    }
    setIsSearch(true);
    const result = routesData.filter((item: any) => {
      return (
        item.path?.startsWith('/components') &&
        (item.path.indexOf(searchText) !== -1 ||
          (item.meta.componentName &&
            item.meta.componentName.indexOf(searchText) !== -1) ||
          (item.meta.title && item.meta.title.indexOf(searchText) !== -1))
      );
    });
    setSearchResult(result);
  };

  return {
    isSearch,
    handleSearch,
    searchResult,
  };
};

export default useSearch;
