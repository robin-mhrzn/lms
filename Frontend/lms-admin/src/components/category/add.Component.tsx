import { Button, Form, Input, Modal, Space, Switch } from "antd";
import { ICategoryDataModel } from "../../services/categoryService/categoryService";
import { useEffect } from "react";

export interface AddComponentProps {
  isModalOpen: boolean;
  data: ICategoryDataModel;
  handleCancel?: () => void;
  handleAddCategory?: (model: any) => void;
}
const AddComponent: React.FC<AddComponentProps> = (props) => {
  const handleAddCategory = (model: ICategoryDataModel) => {
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
        <Form.Item name="isActive" label="Status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
        <Form.Item name="categoryId" hidden>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="parentId" hidden>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="imageUrl" hidden>
          <Input type="hidden" />
        </Form.Item>

        {/* <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button onClick={props.handleCancel}>Cancel</Button>
          </Space>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};
export default AddComponent;
