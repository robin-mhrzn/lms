import React, { useState, useEffect } from "react";
import type { TableColumnsType, TableProps } from "antd";
import { Button, Space, Table } from "antd";

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

interface FetchDataParams<T> {
  pagination: TableProps<T>["pagination"];
  filters: Record<string, any>;
  sorter: Record<string, any>;
  setDataSource: React.Dispatch<React.SetStateAction<T[]>>;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DataTableProps<T> {
  columns: TableColumnsType<T>;
  fetchData: (params: FetchDataParams<T>) => void;
}

const DataTable = <T extends object>({
  columns,
  fetchData,
}: DataTableProps<T>) => {
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});
  const [sortedInfo, setSortedInfo] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData({
      pagination,
      filters: filteredInfo,
      sorter: sortedInfo,
      setDataSource,
      setPagination,
      setLoading,
    });
  }, []);

  const handleChange: TableProps<T>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Record<string, any>);
    fetchData({
      pagination,
      filters,
      sorter,
      setDataSource,
      setPagination,
      setLoading,
    });
  };

  const clearFilters = () => setFilteredInfo({});
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
    fetchData({
      pagination,
      filters: {},
      sorter: {},
      setDataSource,
      setPagination,
      setLoading,
    });
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearFilters}>Clear Filters</Button>
        <Button onClick={clearAll}>Clear Filters & Sorters</Button>
      </Space>
      <Table<T>
        columns={columns.map((col) => ({
          ...col,
          filteredValue: filteredInfo[col.key as string] || null,
          sortOrder: sortedInfo.columnKey === col.key ? sortedInfo.order : null,
        }))}
        dataSource={dataSource}
        pagination={pagination}
        loading={loading}
        onChange={handleChange}
      />
    </>
  );
};

export default DataTable;
