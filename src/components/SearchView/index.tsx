import React from 'react';
import { Input } from 'antd';

interface SearchViewProps {
  handleSearch: (value: string) => void;
}

const SearchView = ({ handleSearch }: SearchViewProps) => {
  return (
    <Input.Search
      style={{ width: '100%', verticalAlign: 'middle' }}
      size="large"
      placeholder="请输入"
      enterButton
      allowClear
      onSearch={handleSearch}
    />
  );
};

export default SearchView;
