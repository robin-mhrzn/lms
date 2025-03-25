import { useEffect, useState } from "react";
import CourseDetailComponent from "../../components/course/courseDetail.Component";
import { useParams } from "react-router-dom";
import {
  CourseModel,
  CourseService,
} from "../../services/courseService/courseService";
import { ResponseModel } from "../../services/apiService";
import { Col, Row } from "antd";
import PublishCourseComponent from "../../components/course/publishCourse.Component";
import CoursePricingComponent from "../../components/course/coursePricing.Component";
import TagsCourseComponent from "../../components/course/tagsCourse.Component";

const CourseDetail = () => {
  const courseService = new CourseService();
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState<CourseModel>(new CourseModel());

  useEffect(() => {
    courseService.getById({
      id: Number(courseId),
      callback: (res?: ResponseModel) => {
        if (res?.success) {
          setCourseData(res.data as CourseModel);
        }
      },
    });
  }, [courseId]);
  return (
    <div className="min-h-screen">
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <CourseDetailComponent
            courseData={courseData}
          ></CourseDetailComponent>
        </Col>
        <Col span={8}>
          <PublishCourseComponent
            courseId={Number(courseId ?? 0)}
          ></PublishCourseComponent>
          <CoursePricingComponent
            courseId={courseData.courseId}
            basePrice={courseData.basePrice}
            price={courseData.price}
          ></CoursePricingComponent>
          <TagsCourseComponent
            courseId={Number(courseId ?? 0)}
            tags={courseData.tags}
          ></TagsCourseComponent>
          {/* <Card
            title="Set Course Pricing"
            className="shadow-lg rounded-2xl text-center p-6 mt-6"
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
          </Card> */}
        </Col>
      </Row>
    </div>
  );
};
export default CourseDetail;
