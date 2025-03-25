import { Button, Card, Form, Input, Select } from "antd";
import { CourseService } from "../../services/courseService/courseService";
import { ResponseModel } from "../../services/apiService";
import { showMessage } from "../../utils/commonUtil";
import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import React from "react";
interface TagsCourseComponentProps {
  courseId: number;
  tags: string[];
}

const TagsCourseComponent: React.FC<TagsCourseComponentProps> = ({
  courseId,
  tags,
}) => {
  const [loader, setLoader] = useState(false);
  const [form] = Form.useForm();

  const courseService = useMemo(() => new CourseService(), []);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    form.setFieldValue("tags", tags);
  }, [tags]);

  const handleSearch = useCallback(
    debounce((value: string) => {
      if (!value.trim()) return;
      courseService.getTags({
        keyword: value,
        callback: (res?: ResponseModel) => {
          if (res?.success) {
            setSuggestions((prevSuggestions) =>
              JSON.stringify(prevSuggestions) === JSON.stringify(res.data)
                ? prevSuggestions
                : (res.data as string[])
            );
          }
        },
      });
    }, 500),
    [courseService]
  );
  const handleSaveTags = useCallback(
    (model: any) => {
      setLoader(true);
      courseService.setCourseTags({
        courseId,
        tags: model.tags,
        callback: (res?: ResponseModel) => {
          if (res?.success) {
            showMessage(true, "Tags set successfully");
          }
          setLoader(false);
        },
      });
    },
    [courseId, courseService]
  );

  return (
    <Card
      title="Set Course Tags"
      className="shadow-lg rounded-2xl text-center p-6 mt-6"
    >
      <Form layout="vertical" form={form} onFinish={handleSaveTags}>
        <Form.Item
          label="Tags"
          name="tags"
          rules={[{ required: true, message: "At least one tag is required" }]}
        >
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Enter tags"
            onSearch={handleSearch}
            options={suggestions.map((tag) => ({ value: tag }))}
          />
        </Form.Item>
        <Form.Item hidden name={"courseId"}>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full mt-4"
            loading={loader}
          >
            Save Tags
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default React.memo(TagsCourseComponent);
