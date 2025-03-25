import { Button, Form, Input, InputNumber, Modal, Space } from "antd";
import React, { useState } from "react";
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
const AddCourseComponent: React.FC<AddCourseComponentProps> = (props) => {
  const handleAddCourse = (model: CourseModel) => {
    if (props.handleAddCourse) {
      props.handleAddCourse(model);
    }
  };

  const [form] = Form.useForm();
  const [parentCategoryId, setParentCategoryId] = useState<number>(0);
  const handleFormChange = (changedValues: any) => {
    if (changedValues.parentCategoryId) {
      setParentCategoryId(changedValues.parentCategoryId);
      form.setFieldsValue({ categoryId: null });
    }
  };

  return (
    <Modal
      title="Add Course"
      open={props.isModalOpen}
      onCancel={props.handleCancel}
      footer={
        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-3">
          <Space>
            <Button onClick={props.handleCancel} className="rounded-lg">
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              className="rounded-lg"
              loading={props.loader}
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
          rules={[
            { required: true, message: "Please enter Parent Category ID" },
          ]}
        >
          <ParentCategory></ParentCategory>
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryId"
          rules={[{ required: true, message: "Please enter Category ID" }]}
        >
          <ChildCategory parentCategoryId={parentCategoryId}></ChildCategory>
        </Form.Item>

        <Form.Item
          label="Course Level"
          name="levelId"
          rules={[{ required: true, message: "Please select Course Level" }]}
        >
          <CourseLevelSelect></CourseLevelSelect>
        </Form.Item>

        <Form.Item
          label="Duration (in hours)"
          name="duration"
          rules={[{ required: true, message: "Please enter Duration" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Language"
          name="languageId"
          rules={[{ required: true, message: "Please enter Language" }]}
        >
          <CourseLanguageSelect></CourseLanguageSelect>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default React.memo(AddCourseComponent);
