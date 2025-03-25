import { Button, Card } from "antd";
import { useState, useCallback, useMemo } from "react";
import { CourseService } from "../../services/courseService/courseService";
import { ResponseModel } from "../../services/apiService";
import { showMessage } from "../../utils/commonUtil";
import { Link } from "react-router-dom";
import React from "react";

interface PublishCourseComponentProps {
  courseId: number;
}

const PublishCourseComponent: React.FC<PublishCourseComponentProps> = ({
  courseId,
}) => {
  const [loader, setLoader] = useState(false);
  const courseService = useMemo(() => new CourseService(), []);
  const handlePublishCourse = useCallback(
    async (isPublished: boolean) => {
      setLoader(true);
      courseService.publishCourse({
        courseId,
        isPublished,
        callback: (res?: ResponseModel) => {
          if (res?.success) {
            showMessage(
              res?.success,
              isPublished
                ? "Course published successfully"
                : "Course unpublished successfully"
            );
          }
          setLoader(false);
        },
      });
    },
    [courseId]
  );

  return (
    <Card
      title="Publish Your Course"
      className="shadow-lg rounded-2xl text-center p-6 mb-4!"
    >
      <div className="mb-4">
        <label className="block text-sm font-semibold">Status</label>
        <div className="text-gray-500">Not Published</div>
      </div>

      <Link
        type="primary"
        className="w-full mt-4"
        onClick={() => handlePublishCourse(false)}
        to={""}
      >
        UnPublish Course
      </Link>

      <Button
        type="primary"
        size="large"
        className="w-full mt-4"
        onClick={() => handlePublishCourse(true)}
        loading={loader}
      >
        Publish Course
      </Button>
    </Card>
  );
};

export default React.memo(PublishCourseComponent);
