import React, { useEffect, useMemo, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  CourseService,
  ICourseAdditional,
  ICourseAdditionalType,
} from "../../services/courseService/courseService";
import { ResponseModel } from "../../services/apiService";
import { showConfirm, showMessage } from "../../utils/commonUtil";
import { Button, Space } from "antd";

interface CourseAdditionalItemComponentProps {
  courseId: number;
  additionalType: ICourseAdditionalType;
  additionalItems: ICourseAdditional[];
}

const CourseAdditionalItemComponent: React.FC<
  CourseAdditionalItemComponentProps
> = ({ additionalType, additionalItems, courseId }) => {
  const [loader, setLoader] = useState(false);
  const courseService = useMemo(() => new CourseService(), []);
  const [editingItem, setEditingItem] = useState<ICourseAdditional>({
    courseAdditionalId: 0,
    courseAdditionalTypeId: additionalType.courseAdditionalTypeId,
    courseId,
    description: "",
  });
  const [updateAdditionalItem, setUpdateAdditionalItem] = useState<
    ICourseAdditional[]
  >([]);

  useEffect(() => {
    setUpdateAdditionalItem([...additionalItems]);
  }, [additionalItems]);

  const handleEditChange = (item: ICourseAdditional) => {
    setEditingItem(item);
  };

  const handleSaveEdit = () => {
    if (!editingItem.description.trim()) return;

    const updatedItem = {
      ...editingItem,
      courseId,
      courseAdditionalTypeId: additionalType.courseAdditionalTypeId,
    };
    setLoader(true);
    courseService.saveCourseAdditional({
      data: updatedItem,
      callback: (res?: ResponseModel) => {
        setLoader(false);
        if (res?.success) {
          updatedItem.courseAdditionalId = res.data.id;
          showMessage(true, "Item saved successfully");
          setUpdateAdditionalItem((prev) =>
            prev.some(
              (item) =>
                item.courseAdditionalId === updatedItem.courseAdditionalId
            )
              ? prev.map((item) =>
                  item.courseAdditionalId === updatedItem.courseAdditionalId
                    ? updatedItem
                    : item
                )
              : [...prev, updatedItem]
          );
          resetEditingItem();
        }
      },
    });
  };

  const handleCancel = () => {
    resetEditingItem();
  };

  const handleDelete = (courseAdditionalId: number) => {
    showConfirm("Are you sure you want to delete this item?", () => {
      setLoader(true);
      courseService.deleteCourseAdditional({
        id: courseAdditionalId,
        callback: (res?: ResponseModel) => {
          setLoader(false);
          if (res?.success) {
            showMessage(true, "Item deleted successfully");
            setUpdateAdditionalItem((prev) =>
              prev.filter(
                (item) => item.courseAdditionalId !== courseAdditionalId
              )
            );
          }
        },
      });
    });
  };

  const resetEditingItem = () => {
    setEditingItem({
      courseAdditionalId: 0,
      courseAdditionalTypeId: additionalType.courseAdditionalTypeId,
      courseId,
      description: "",
    });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex gap-2 mb-4">
        <input
          className="flex-grow p-2 border rounded-md"
          placeholder={`Add new ${additionalType.additionalType}`}
          value={editingItem.description}
          onChange={(e) =>
            setEditingItem({ ...editingItem, description: e.target.value })
          }
        />
        <Space>
          <Button
            type="primary"
            onClick={handleSaveEdit}
            disabled={!editingItem.description.trim()}
            loading={loader}
          >
            {editingItem.courseAdditionalId > 0 ? "Update" : "Save"}
          </Button>
          {editingItem.courseAdditionalId > 0 && (
            <Button type="primary" danger onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </Space>
      </div>

      {updateAdditionalItem.length > 0 ? (
        updateAdditionalItem.map((additional) => (
          <div
            key={additional.courseAdditionalId}
            className="p-4 bg-white rounded-md shadow-md mb-2 flex justify-between items-center"
          >
            <p className="flex-grow">{additional.description}</p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleEditChange(additional)}
                loading={loader}
                type="primary"
              >
                <EditOutlined />
              </Button>
              <Button
                danger
                type="primary"
                onClick={() => handleDelete(additional.courseAdditionalId)}
                loading={loader}
              >
                <DeleteOutlined />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No items to display</p>
      )}
    </div>
  );
};

export default CourseAdditionalItemComponent;
