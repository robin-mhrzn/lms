import { Button, Form, Input, InputNumber, Modal, Space } from "antd";
import React, { useState, useEffect } from "react";
import { CourseModel } from "../../services/courseService/courseService";
import ParentCategory from "../select/category/parentCategory";
import ChildCategory from "../select/category/childCategory";
import CourseLevelSelect from "../select/course/courseLevel.select";
import CourseLanguageSelect from "../select/course/courseLanguage.select";

export interface AddCourseComponentProps {
  isModalOpen: boolean;
  handleCancel?: () => void;
  handleAddCourse?: (model: CourseModel) => void;
  loader: boolean;
}

const AddCourseComponent: React.FC<AddCourseComponentProps> = ({
  isModalOpen,
  handleCancel,
  handleAddCourse,
  loader,
}) => {
  const [form] = Form.useForm();
  const [parentCategoryId, setParentCategoryId] = useState<number>(0);

  useEffect(() => {
    form.setFieldsValue({ categoryId: null });
  }, [parentCategoryId, form]);

  const handleFormChange = (changedValues: any) => {
    if (changedValues.parentCategoryId) {
      setParentCategoryId(changedValues.parentCategoryId);
    }
  };

  return (
    <Modal
      title="Add Course"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={
        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-3">
          <Space>
            <Button onClick={handleCancel} className="rounded-lg">
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              className="rounded-lg"
              loading={loader}
            >
              Submit
            </Button>
          </Space>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleAddCourse}
        onValuesChange={handleFormChange}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter Title" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Parent Category"
          name="parentCategoryId"
          rules={[{ required: true, message: "Please select Parent Category" }]}
        >
          <ParentCategory />
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryId"
          rules={[{ required: true, message: "Please select Category" }]}
        >
          <ChildCategory parentCategoryId={parentCategoryId} />
        </Form.Item>

        <Form.Item
          label="Course Level"
          name="levelId"
          rules={[{ required: true, message: "Please select Course Level" }]}
        >
          <CourseLevelSelect />
        </Form.Item>

        <Form.Item
          label="Duration (minutes)"
          name="duration"
          rules={[{ required: true, message: "Please enter Duration" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Language"
          name="languageId"
          rules={[{ required: true, message: "Please select Language" }]}
        >
          <CourseLanguageSelect />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(AddCourseComponent);
