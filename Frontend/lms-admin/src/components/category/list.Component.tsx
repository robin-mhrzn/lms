import { useCallback, useEffect, useState } from "react";
import { Button, Space, Table, TableColumnsType, TableProps } from "antd";
import {
  CategoryService,
  ICategoryDataModel,
  ICategoryListRequestModel,
} from "../../services/categoryService/categoryService";
import { ResponseModel } from "../../services/apiService";
import AddComponent, { AddComponentProps } from "./add.Component";
import { showConfirm, showMessage } from "../../utils/commonUtil";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../utils/Navigation";
import { FileUploadService } from "../../services/fileUploadService/fileUploadService";
import { RcFile } from "antd/es/upload";
import { EnumImageType } from "../../utils/enumerations";

type OnChange = NonNullable<TableProps<ICategoryDataModel>["onChange"]>;
type Filters = Parameters<OnChange>[1];
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;
type CategoryListProps = {
  parentId?: number;
  name?: string;
};
const CategoryList: React.FC<CategoryListProps> = (props) => {
  const service = new CategoryService();
  const fileService = new FileUploadService();
  const navigate = useNavigate();
  const [file, setFile] = useState<RcFile | null>(null);
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [data, setDataSource] = useState<ICategoryDataModel[]>([]);
  const [pagination, setPagination] = useState<ICategoryListRequestModel>({
    currentPage: 1,
    pageSize: 10,
    sortField: "",
    sortOrder: "",
    total: 0,
    parentId: props.parentId,
  });
  const [addModal, setAddModal] = useState<AddComponentProps>({
    isModalOpen: false,
    data: {} as ICategoryDataModel,
    loader: false,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const columns: TableColumnsType<ICategoryDataModel> = [
    {
      title: "Category Id",
      dataIndex: "categoryId",
      key: "categoryId",
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === "categoryId" ? sortedInfo.order : null,
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (isActive ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              handleDelete(record.categoryId);
            }}
          >
            Delete
          </Button>
          {props.parentId == null && (
            <Button
              type="default"
              onClick={() =>
                navigate(
                  `${PATHS.CATEGORY}/${record.categoryId}/${record.name}`
                )
              }
            >
              View Subcategories
            </Button>
          )}
        </Space>
      ),
    },
  ];
  const handleEdit = useCallback((record: ICategoryDataModel) => {
    setAddModal({ ...addModal, isModalOpen: true, data: record });
    setFile(null);
  }, []);
  const handleModalPopup = useCallback(() => {
    setFile(null);
    setAddModal({
      ...addModal,
      isModalOpen: true,
      data: {
        categoryId: 0,
        description: "",
        isActive: false,
        imageUrl: "",
        name: "",
        parentId: pagination.parentId,
        parentName: "",
      } as ICategoryDataModel,
    });
  }, [pagination.parentId]);
  const handelCancelPopup = () => {
    setAddModal({
      ...addModal,
      isModalOpen: false,
      data: {} as ICategoryDataModel,
    });
  };
  const fetchData = useCallback(
    (
      paginationParams: ICategoryListRequestModel,
      filters: Filters,
      sorter: Sorts
    ) => {
      setLoading(true);
      service.list({
        data: paginationParams,
        callback: (res?: ResponseModel) => {
          if (res != null && res.success === true) {
            setDataSource(res.data.data);
            paginationParams.total = res.data.totalRecord;
            setPagination(paginationParams);
          } else {
            setDataSource([]);
            setPagination({
              currentPage: 1,
              pageSize: paginationParams.pageSize,
              sortField: "",
              sortOrder: "",
              total: 0,
            });
          }
          setLoading(false);
        },
      });
    },
    []
  );

  useEffect(() => {
    const updatePagination = { ...pagination, parentId: props.parentId };
    debugger;
    setPagination(updatePagination);
    fetchData(updatePagination, filteredInfo, sortedInfo);
  }, [props.parentId]);

  const handleChange: OnChange = useCallback(
    (tablePagination: any, filters, sorter: any) => {
      const updatedPagination = {
        ...pagination,
        pageSize: tablePagination.pageSize,
        currentPage: tablePagination.current,
        sortField: sorter?.field || pagination.sortField,
        sortOrder:
          sorter?.order === "ascend"
            ? "asc"
            : sorter?.order === "descend"
            ? "desc"
            : "",
      };
      fetchData(updatedPagination, filters, sorter);
      setFilteredInfo(filters);
      setSortedInfo(sorter as Sorts);
    },
    [fetchData, pagination.sortField]
  );
  const handleDelete = (id: number) => {
    showConfirm("Are you sure you want to delete this record?", () => {
      service.deleteCategory({
        id: id,
        callback: (res?: ResponseModel) => {
          if (res?.success == true) {
            fetchData(pagination, filteredInfo, sortedInfo);
          }
        },
      });
    });
  };

  // const clearFilters = () => {
  //   setFilteredInfo({});
  //   fetchData(pagination, {}, sortedInfo);
  // };

  // const clearAll = () => {
  //   setFilteredInfo({});
  //   setSortedInfo({});
  //   fetchData(pagination, {}, {});
  // };
  const handleAddCategory = useCallback(
    (model: ICategoryDataModel) => {
      setAddModal({ ...addModal, loader: true });
      fileService.uploadImage({
        fileType: EnumImageType.Category,
        file: file,
        callback: (res: ResponseModel) => {
          if (res.success) {
            if (res.data != "" && res.data != null) {
              model.imageUrl = res.data;
            }
            service.saveCategory({
              data: model,
              callback: (res?: ResponseModel) => {
                if (res?.success) {
                  showMessage(true, "Record saved successfully");
                  fetchData(pagination, filteredInfo, sortedInfo);
                  setAddModal({
                    ...addModal,
                    isModalOpen: false,
                    data: {} as ICategoryDataModel,
                    loader: false,
                  });
                } else {
                  setAddModal({ ...addModal, loader: false });
                }
              },
            });
          } else {
            setAddModal({ ...addModal, loader: false });
          }
        },
      });
    },
    [fetchData, file, pagination, filteredInfo, sortedInfo]
  );
  return (
    <div>
      {props.parentId && (
        <div className="mb-4 p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-bold text-gray-800">
            Parent Category: <span className="text-blue-600">{props.name}</span>
          </h2>
          <Button
            type="default"
            className="mt-2"
            onClick={() => navigate(PATHS.CATEGORY)}
          >
            Back to Main Categories
          </Button>
        </div>
      )}
      <AddComponent
        {...addModal}
        handleCancel={handelCancelPopup}
        handleAddCategory={handleAddCategory}
        setFile={setFile}
      ></AddComponent>
      <div className="mb-2">
        <Button type="primary" onClick={handleModalPopup} className="mb-4">
          Add Category
        </Button>
      </div>
      <Table<ICategoryDataModel>
        columns={columns}
        dataSource={data}
        onChange={handleChange}
        loading={loading}
        pagination={{
          current: pagination.currentPage,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        rowKey="categoryId"
      />
    </div>
  );
};

export default CategoryList;
