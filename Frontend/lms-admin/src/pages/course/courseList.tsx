import { useEffect, useState } from "react";
import { Button, Space, Table, TableColumnsType, TableProps } from "antd";
import AddCourseComponent, {
  AddCourseComponentProps,
} from "../../components/course/addCourse.Component";
import {
  CourseModel,
  CourseService,
  ICourseListModel,
  ICourseListRequestModel,
} from "../../services/courseService/courseService";
import { ResponseModel } from "../../services/apiService";
import { showMessage } from "../../utils/commonUtil";
import TableSearch from "../../components/common/Table/TableSearch";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../utils/Navigation";

type OnChange = NonNullable<TableProps<ICourseListModel>["onChange"]>;
type Filters = Parameters<OnChange>[1];
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const CourseList = () => {
  const navigate = useNavigate();
  const courseService = new CourseService();
  const [addCourse, setAddCourse] = useState<AddCourseComponentProps>({
    isModalOpen: false,
    loader: false,
  });
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<ICourseListRequestModel>({
    currentPage: 1,
    pageSize: 10,
    sortField: "",
    sortOrder: "",
    total: 0,
    filters: [],
  });
  const [dataSource, setDataSource] = useState<ICourseListModel[]>([]);
  const columns: TableColumnsType<ICourseListModel> = [
    {
      title: "Course Id",
      dataIndex: "courseId",
      key: "courseId",
      width: "15%",
      sorter: true,
      sortOrder: sortedInfo.columnKey === "courseId" ? sortedInfo.order : null,
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ...TableSearch<ICourseListModel>({ dataIndex: "name" }),
    },
    {
      title: "Parent Category",
      dataIndex: "parentCategoryName",
      key: "parentCategoryName",
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === "parentCategoryName" ? sortedInfo.order : null,
      ...TableSearch<ICourseListModel>({ dataIndex: "parentCategoryName" }),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === "categoryName" ? sortedInfo.order : null,
      ...TableSearch<ICourseListModel>({ dataIndex: "categoryName" }),
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      sorter: true,
      sortOrder: sortedInfo.columnKey === "language" ? sortedInfo.order : null,
      ...TableSearch<ICourseListModel>({ dataIndex: "language" }),
    },
    {
      title: "Is Published",
      dataIndex: "isPublished",
      key: "isPublished",
      width: "15%",
      render: (isPublished: boolean) =>
        isPublished ? "Published" : "UnPublished",
      filters: [
        {
          text: "Published",
          value: "True",
        },
        {
          text: "UnPublished",
          value: "False",
        },
      ],
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
              //handleDelete(record.categoryId);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  const handleEdit = (model: ICourseListModel) => {
    navigate(PATHS.COURSEDETAIL + "/" + model.courseId);
  };
  const handleModalClose = () => {
    setAddCourse({ ...addCourse, isModalOpen: false });
  };
  const handleAddCourse = () => {
    setAddCourse({ ...addCourse, isModalOpen: true });
  };
  const handleSaveCourse = (model: CourseModel) => {
    setAddCourse({ ...addCourse, loader: true });
    model.courseId = 0;
    courseService.saveCourse({
      data: model,
      callback: (res?: ResponseModel) => {
        if (res?.success == true) {
          showMessage(true, "Record saved successfully");
          setAddCourse({ ...addCourse, isModalOpen: false, loader: false });
          fetchData(pagination, filteredInfo, sortedInfo);
        } else {
          setAddCourse({ ...addCourse, loader: false });
        }
      },
    });
  };
  const fetchData = (
    paginationParams: ICourseListRequestModel,
    filters: Filters,
    sorter: Sorts
  ) => {
    setLoading(true);
    const updatePagination = {
      ...paginationParams,
      sortField: sorter?.field || pagination.sortField,
      sortOrder:
        sorter?.order === "ascend"
          ? "asc"
          : sorter?.order === "descend"
          ? "desc"
          : "",
      filters: [],
    } as ICourseListRequestModel;
    if (filters && Object.keys(filters).length > 0) {
      Object.keys(filters).forEach((key) => {
        if ((filters[key] ?? []).length > 0) {
          let filterValue = String(filters[key]?.[0] ?? "");
          if ((filters[key]?.length ?? 0) > 1 && key === "isPublished") {
            filterValue = "";
          }
          updatePagination.filters.push({
            fieldName: key,
            fieldValue: filterValue,
          });
        }
      });
    }
    courseService.list({
      data: updatePagination,
      callback: (res?: ResponseModel) => {
        if (res != null && res.success === true) {
          setDataSource(res.data.data);
          paginationParams.total = res.data.totalRecord;
          setPagination(paginationParams);
        } else {
          setDataSource([]);
          setPagination({
            ...pagination,
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
  };
  const handleChange: OnChange = (
    tablePagination: any,
    filters,
    sorter: any
  ) => {
    const updatedPagination = {
      ...pagination,
      pageSize: tablePagination.pageSize,
      currentPage: tablePagination.current,
    };
    fetchData(updatedPagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };
  useEffect(() => {
    const updatePagination = { ...pagination };
    setPagination(updatePagination);
    fetchData(updatePagination, filteredInfo, sortedInfo);
  }, []);
  return (
    <>
      <AddCourseComponent
        {...addCourse}
        handleAddCourse={handleSaveCourse}
        handleCancel={() => {
          handleModalClose();
        }}
      ></AddCourseComponent>
      <div className="mb-2">
        <Button
          type="primary"
          onClick={() => {
            handleAddCourse();
          }}
        >
          Add
        </Button>
      </div>
      <Table<ICourseListModel>
        columns={columns}
        dataSource={dataSource}
        onChange={handleChange}
        loading={loading}
        pagination={{
          current: pagination.currentPage,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        rowKey="courseId"
      />
    </>
  );
};
export default CourseList;
