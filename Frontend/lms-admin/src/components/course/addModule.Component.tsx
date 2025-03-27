import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Space, Card, InputNumber } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { IModuleModel } from "../../services/courseService/courseService";
export interface AddModuleComponentProps {
  isModalOpen: boolean;
  loader: boolean;
  courseId: number;
  moduleId: number;
  handleCancel?: () => void;
  handleSave?: (values: IModuleModel) => void;
  data: IModuleModel;
}
const AddModuleComponent: React.FC<AddModuleComponentProps> = ({
  isModalOpen,
  loader,
  data,
  handleCancel,
  handleSave,
}) => {
  const [form] = Form.useForm();
  const onFinish = (values: IModuleModel) => {
    if (handleSave) {
      handleSave(values);
    }
  };
  useEffect(() => {
    form.setFieldsValue(data);
  }, [data]);
  return (
    <Modal
      title="Add Module"
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
        onFinish={onFinish}
        initialValues={{ lessons: [{}] }}
      >
        <Form.Item hidden name="courseId">
          <Input type="hidden" />
        </Form.Item>
        <Form.Item hidden name="moduleId">
          <Input type="hidden" />
        </Form.Item>

        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.List name="lessons">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Card
                  key={key}
                  title={`Lesson ${name + 1}`}
                  style={{ marginBottom: "16px" }}
                  extra={
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ color: "red" }}
                    />
                  }
                >
                  <Form.Item {...restField} name={[name, "lessonId"]} hidden>
                    <Input type="hidden"></Input>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "title"]}
                    label="Title"
                    rules={[{ required: true, message: "Title is required" }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    label="Description"
                    rules={[
                      { required: true, message: "Description is required" },
                    ]}
                  >
                    <Input.TextArea rows={2} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "duration"]}
                    label="Duration (minutes)"
                    rules={[
                      { required: true, message: "Duration is required" },
                    ]}
                  >
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "videoUrl"]}
                    label="Video URL"
                    rules={[
                      { required: true, message: "Video URL is required" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Card>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Lesson
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default AddModuleComponent;
