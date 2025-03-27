import Icon, {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { Button, Card, Dropdown, List, Menu } from "antd";
import {
  CourseService,
  IModuleListModel,
  IModuleModel,
} from "../../services/courseService/courseService";
import { useCallback, useEffect, useState } from "react";
import { ResponseModel } from "../../services/apiService";
import AddModuleComponent, {
  AddModuleComponentProps,
} from "./addModule.Component";
import { showConfirm, showMessage } from "../../utils/commonUtil";
import SortModuleComponent from "./sortModule.Component";
import SortLessonComponent from "./sortLesson.Component";
import React from "react";

interface ModuleListComponentProps {
  courseId: number;
}

const ModuleListComponent: React.FC<ModuleListComponentProps> = ({
  courseId,
}) => {
  const courseService = new CourseService();
  const [modalState, setModalState] = useState({
    addModule: {
      isModalOpen: false,
      loader: false,
      data: {},
      moduleId: 0,
    } as AddModuleComponentProps,
    sortLesson: { isModalOpen: false, loader: false, lessons: [], moduleId: 0 },
    sortModule: { isModalOpen: false, loader: false, modules: [] },
  });

  const [moduleList, setModuleList] = useState<IModuleListModel[]>([]);

  const loadModule = useCallback(async () => {
    await courseService.getModuleByCourse({
      id: courseId,
      callback: (res?: ResponseModel) => {
        if (res?.success) {
          setModuleList(res.data as IModuleListModel[]);
        }
      },
    });
  }, [courseId]);

  useEffect(() => {
    loadModule();
  }, [loadModule]);

  const handleModuleOpen = (moduleId: number) => {
    setModalState((prevState) => ({
      ...prevState,
      addModule: {
        ...prevState.addModule,
        isModalOpen: true,
        moduleId,
        data: { courseId, description: "", lessons: [], moduleId, title: "" },
      },
    }));
  };

  const handleModalClose = () => {
    setModalState((prevState) => ({
      ...prevState,
      addModule: { ...prevState.addModule, isModalOpen: false },
    }));
  };

  const handleSortLessonModalClose = () => {
    setModalState((prevState) => ({
      ...prevState,
      sortLesson: { ...prevState.sortLesson, isModalOpen: false },
    }));
  };

  const handleSortModalClose = () => {
    setModalState((prevState) => ({
      ...prevState,
      sortModule: { ...prevState.sortModule, isModalOpen: false },
    }));
  };

  const handleSaveModule = (model: IModuleModel) => {
    setModalState((prevState) => ({
      ...prevState,
      addModule: { ...prevState.addModule, loader: true },
    }));

    try {
      model.courseId = courseId;
      courseService.saveModule({
        data: model,
        callback: (res?: ResponseModel) => {
          if (res?.success) {
            showMessage(true, "Record saved successfully");
            setModalState((prevState) => ({
              ...prevState,
              addModule: {
                ...prevState.addModule,
                loader: false,
                isModalOpen: false,
              },
            }));
            loadModule();
          } else {
            setModalState((prevState) => ({
              ...prevState,
              addModule: { ...prevState.addModule, loader: false },
            }));
          }
        },
      });
    } catch (error) {
      console.error(error);
      setModalState((prevState) => ({
        ...prevState,
        addModule: { ...prevState.addModule, loader: false },
      }));
    }
  };

  const handleMenuClick = (moduleId: number, menuKey: string) => {
    if (menuKey === "edit") {
      courseService.getModuleById({
        moduleId,
        callback: (res?: ResponseModel) => {
          if (res?.success) {
            setModalState((prevState) => ({
              ...prevState,
              addModule: {
                ...prevState.addModule,
                data: res.data,
                isModalOpen: true,
              },
            }));
          }
        },
      });
    } else if (menuKey === "sort") {
      courseService.getModuleById({
        moduleId,
        callback: (res?: ResponseModel) => {
          if (res?.success) {
            setModalState((prevState) => ({
              ...prevState,
              sortLesson: {
                ...prevState.sortLesson,
                lessons: res.data.lessons,
                isModalOpen: true,
                moduleId,
              },
            }));
          }
        },
      });
    } else if (menuKey === "delete") {
      showConfirm("Are you sure you want to delete this module?", () => {
        courseService.deleteModule({
          moduleId,
          callback: (res?: ResponseModel) => {
            if (res?.success) {
              showMessage(true, "Record deleted successfully");
              loadModule();
            }
          },
        });
      });
    }
  };

  const handleSortModule = async (moduleId: number[]) => {
    await courseService.sortModule({
      courseId,
      moduleId,
      callback: (res?: ResponseModel) => {
        if (res?.success) {
          setModalState((prevState) => ({
            ...prevState,
            sortModule: { ...prevState.sortModule, isModalOpen: false },
          }));
          showMessage(true, "Module sorted successfully");
          loadModule();
        }
      },
    });
  };

  const handleSortLesson = async (moduleId: number, lessonId: number[]) => {
    await courseService.sortLesson({
      moduleId,
      lessonId,
      callback: (res?: ResponseModel) => {
        if (res?.success) {
          showMessage(true, "Lesson sorted successfully");
          setModalState((prevState) => ({
            ...prevState,
            sortLesson: { ...prevState.sortLesson, isModalOpen: false },
          }));
        }
      },
    });
  };

  const menuItems = [
    { key: "edit", label: "Edit", icon: <EditOutlined /> },
    { key: "sort", label: "Sort Level", icon: <SortAscendingOutlined /> },
    { key: "delete", label: "Delete", icon: <DeleteOutlined />, danger: true },
  ];

  return (
    <>
      <AddModuleComponent
        {...modalState.addModule}
        handleSave={handleSaveModule}
        handleCancel={handleModalClose}
      />
      <SortLessonComponent
        {...modalState.sortLesson}
        handleCancel={handleSortLessonModalClose}
        onSaveSort={handleSortLesson}
      />
      <SortModuleComponent
        {...modalState.sortModule}
        modules={moduleList}
        onSaveSort={handleSortModule}
        handleCancel={handleSortModalClose}
      />
      <Card title="Module List" className="shadow-lg rounded-2xl p-6 mt-6">
        <div className="text-right">
          <Button
            type="primary"
            icon={<SortAscendingOutlined />}
            className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 flex items-center gap-2 shadow-md"
            onClick={() =>
              setModalState((prevState) => ({
                ...prevState,
                sortModule: { ...prevState.sortModule, isModalOpen: true },
              }))
            }
          >
            Sort Modules
          </Button>
        </div>
        <List
          itemLayout="horizontal"
          dataSource={moduleList}
          renderItem={(course) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <span className="font-semibold">
                    {course.name} <span className="text-blue-500">✔</span>
                  </span>
                }
                description={
                  <>
                    <p>{course.description}</p>
                    <p className="text-gray-500">
                      {course.lessons} Lessons • {course.duration} Minutes
                    </p>
                  </>
                }
              />
              <Dropdown
                menu={{
                  items: menuItems,
                  onClick: ({ key }) => handleMenuClick(course.moduleId, key),
                }}
                trigger={["click"]}
              >
                <MoreOutlined style={{ fontSize: 20, cursor: "pointer" }} />
              </Dropdown>
            </List.Item>
          )}
        />
        <Button
          type="dashed"
          block
          icon={<PlusOutlined />}
          onClick={() => handleModuleOpen(0)}
        >
          Add New Module
        </Button>
      </Card>
    </>
  );
};

export default ModuleListComponent;
