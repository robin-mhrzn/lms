import {
  CloudUploadOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  List,
  Row,
  Select,
  Typography,
  Upload,
} from "antd";
import ModuleCard from "./moduleList.Component";

const CourseDetailComponent = () => {
  const requirements = [
    "This course requires proficiency in English language as the Lessons are prepared in English.",
    "Learners with following skills might be more benefited, but little extra work is all that’ll take.",
  ];
  return (
    <div className="p-6  min-h-screen">
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card title="Course Detail" className="shadow-lg rounded-2xl">
            <Form layout="vertical">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Title is required" }]}
                  >
                    <Input placeholder="Enter course title" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Category"
                    name="parentId"
                    rules={[
                      { required: true, message: "Category is required" },
                    ]}
                  >
                    <Select placeholder="Select category"></Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Sub Category"
                    name="categoryId"
                    rules={[
                      { required: true, message: "Category is required" },
                    ]}
                  >
                    <Select placeholder="Select category"></Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Course Level"
                    name="courseLevel"
                    rules={[{ required: true, message: "Select course level" }]}
                  >
                    <Select placeholder="Select level"></Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Language"
                    name="language"
                    rules={[
                      { required: true, message: "Language is required" },
                    ]}
                  >
                    <Select placeholder="Select language"></Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Duration (hours)"
                    name="duration"
                    rules={[
                      { required: true, message: "Duration is required" },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      style={{ width: "100%" }}
                      placeholder="Enter duration"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      { required: true, message: "Description is required" },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Enter course description"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Upload Image" name="image">
                    <Upload beforeUpload={() => false} listType="picture">
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                {/* Submit Button */}
                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <ModuleCard></ModuleCard>

          <Card
            title="Requirements"
            className="shadow-lg rounded-2xl p-6 mt-6"
            bordered={false}
          >
            <List
              dataSource={requirements}
              renderItem={(requirement, index) => (
                <List.Item>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-gray-700">{requirement}</span>
                    <div className="flex items-center">
                      <EditOutlined className="mx-2 cursor-pointer text-blue-500" />
                      <DeleteOutlined className="cursor-pointer text-red-500" />
                    </div>
                  </div>
                </List.Item>
              )}
            />
            <Input placeholder="Add another requirement..." className="mt-4" />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Publish Your Course"
            className="shadow-lg rounded-2xl text-center p-6 mb-4"
            bordered={false}
          >
            <div className="mb-4">
              <label className="block text-sm font-semibold">Status</label>
              <div className="text-gray-500">Not Published</div>
            </div>
            <Button type="primary" size="large" className="w-full mt-4">
              Publish Course
            </Button>
          </Card>
          <Card
            title="Set Course Pricing"
            className="shadow-lg rounded-2xl text-center p-6 mt-6"
            bordered={false}
          >
            <Form layout="vertical">
              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Price is required" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="Enter price"
                />
              </Form.Item>
              <Form.Item label="Discount Price" name="price">
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="Enter price"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" size="large" className="w-full mt-4">
                  Save Pricing
                </Button>
              </Form.Item>
            </Form>
          </Card>
          <Card
            title="Set Course Tags"
            className="shadow-lg rounded-2xl text-center p-6 mt-6"
            bordered={false}
          >
            <Form layout="vertical">
              <Form.Item
                label="Tags"
                name="tags"
                rules={[
                  { required: true, message: "At least one tag is required" },
                ]}
              >
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Enter tags"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" size="large" className="w-full mt-4">
                  Save Tags
                </Button>
              </Form.Item>
            </Form>
          </Card>
          <Card
            title="Upload Cover Photo"
            className="shadow-lg rounded-2xl p-6 mt-6"
            bordered={false}
          >
            <Upload.Dragger accept="image/*" showUploadList={false}>
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="text-gray-700">Drag your image here</p>
              <p className="text-blue-500 cursor-pointer">or, Browse</p>
            </Upload.Dragger>
          </Card>

          <Card
            title="Upload Preview Video"
            className="shadow-lg rounded-2xl p-6 mt-6"
            bordered={false}
          >
            <Upload.Dragger accept="video/mp4,video/mkv" showUploadList={false}>
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="text-gray-700">Drag your .mp4 or .mkv file here</p>
              <p className="text-blue-500 cursor-pointer">or, Browse</p>
            </Upload.Dragger>
            <Input placeholder="Paste YouTube link here" className="mt-4" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CourseDetailComponent;
