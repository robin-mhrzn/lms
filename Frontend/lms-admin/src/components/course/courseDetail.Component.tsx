import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Card, Col, Form, Input, InputNumber, Row } from "antd";
import {
  CourseModel,
  CourseService,
} from "../../services/courseService/courseService";
import ParentCategory from "../select/category/parentCategory";
import ChildCategory from "../select/category/childCategory";
import CourseLanguageSelect from "../select/course/courseLanguage.select";
import CourseLevelSelect from "../select/course/courseLevel.select";
import { ResponseModel } from "../../services/apiService";
import { showMessage } from "../../utils/commonUtil";

type CourseDetailProps = {
  courseData: CourseModel;
};

const CourseDetailComponent: React.FC<CourseDetailProps> = ({ courseData }) => {
  const courseService = useMemo(() => new CourseService(), []);
  const [loading, setLoading] = useState(false);
  const [parentCategoryId, setParentCategoryId] = useState<number>(
    courseData?.parentCategoryId || 0
  );
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(courseData);
    setParentCategoryId(courseData?.parentCategoryId || 0);
  }, [courseData, form]);

  const handleFormChange = useCallback(
    (changedValues: any) => {
      if (changedValues.parentCategoryId) {
        setParentCategoryId(changedValues.parentCategoryId);
        form.setFieldsValue({ categoryId: null });
      }
    },
    [form]
  );

  const handleSaveCourse = useCallback(
    async (model: CourseModel) => {
      setLoading(true);
      try {
        await courseService.saveCourse({
          data: model,
          callback: (res?: ResponseModel) => {
            if (res?.success) {
              showMessage(true, "Record saved successfully");
            }
          },
        });
      } finally {
        setLoading(false);
      }
    },
    [courseService]
  );

  return (
    <Card title="Course Detail" className="shadow-lg rounded-2xl">
      <Form
        layout="vertical"
        form={form}
        onValuesChange={handleFormChange}
        onFinish={handleSaveCourse}
      >
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
              name="parentCategoryId"
              rules={[{ required: true, message: "Category is required" }]}
            >
              <ParentCategory />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Sub Category"
              name="categoryId"
              rules={[{ required: true, message: "Sub Category is required" }]}
            >
              <ChildCategory parentCategoryId={parentCategoryId} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Course Level"
              name="levelId"
              rules={[{ required: true, message: "Select course level" }]}
            >
              <CourseLevelSelect />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Language"
              name="languageId"
              rules={[{ required: true, message: "Language is required" }]}
            >
              <CourseLanguageSelect />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Duration (minutes)"
              name="duration"
              rules={[{ required: true, message: "Duration is required" }]}
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
              rules={[{ required: true, message: "Description is required" }]}
            >
              <Input.TextArea rows={4} placeholder="Enter course description" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="courseId" hidden>
              <Input type="hidden" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default React.memo(CourseDetailComponent);
