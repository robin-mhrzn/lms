import { Button, Card, Form, Input, InputNumber } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CourseService } from "../../services/courseService/courseService";
import { ResponseModel } from "../../services/apiService";
import { showMessage } from "../../utils/commonUtil";

interface CoursePricingComponentProps {
  courseId: number;
  basePrice: number;
  price: number;
}
const CoursePricingComponent: React.FC<CoursePricingComponentProps> = (
  props
) => {
  const courseService = useMemo(() => new CourseService(), []);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    if (props.courseId > 0) {
      form.setFieldsValue(props);
    }
  }, [props]);
  const handleSetPricing = useCallback(
    (model: CoursePricingComponentProps) => {
      setLoading(true);
      try {
        courseService.setCoursePricing({
          courseId: model.courseId,
          basePrice: model.basePrice,
          price: model.price,
          callback: (res?: ResponseModel) => {
            if (res?.success) {
              showMessage(true, res.message);
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
    <Card
      title="Set Course Pricing"
      className="shadow-lg rounded-2xl text-center p-6 mt-6"
    >
      <Form layout="vertical" form={form} onFinish={handleSetPricing}>
        <Form.Item
          label="Base Price"
          name="basePrice"
          rules={[{ required: true, message: "Base price is required" }]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="Base Price"
          />
        </Form.Item>
        <Form.Item
          label="Discount Price"
          name="price"
          rules={[{ required: true, message: "Price is required" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} placeholder="Price" />
        </Form.Item>
        <Form.Item name="courseId" hidden>
          <Input type="hidden"></Input>
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            className="w-full mt-4"
            loading={loading}
          >
            Save Pricing
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default React.memo(CoursePricingComponent);
