import { Button, Form, Input, Modal, Space, Switch } from "antd";
import { ICategoryDataModel } from "../../services/categoryService/categoryService";
import { useEffect, useState } from "react";
import { RcFile } from "antd/es/upload";
import ImageUploader from "../common/ImageUpload/ImageUploader";

export interface AddComponentProps {
  isModalOpen: boolean;
  data: ICategoryDataModel;
  setFile?: (file: RcFile) => void;
  handleCancel?: () => void;
  handleAddCategory?: (model: any) => void;
  loader: boolean;
}
const AddComponent: React.FC<AddComponentProps> = (props) => {
  const handleAddCategory = async (model: ICategoryDataModel) => {
    if (props.handleAddCategory) {
      props.handleAddCategory(model);
    }
  };

  const [form] = Form.useForm();
  useEffect(() => {
    if (props.data) {
      form.setFieldsValue(props.data);
    }
  }, [props.data, form]);

  return (
    <Modal
      title="Add Category"
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
      <Form form={form} layout="vertical" onFinish={handleAddCategory}>
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: "Please enter category name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description!" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Upload Image">
          <ImageUploader
            fileUrl={props.data?.imageUrl}
            onChange={function (file: RcFile): void {
              if (props.setFile) {
                props.setFile(file);
              }
            }}
          ></ImageUploader>
        </Form.Item>
        <Form.Item name="isActive" label="Status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
        <Form.Item name="categoryId" hidden>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="parentId" hidden>
          <Input type="hidden" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AddComponent;
