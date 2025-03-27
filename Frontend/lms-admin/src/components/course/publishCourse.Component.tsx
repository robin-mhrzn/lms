import { Button, Card } from "antd";
import { useState, useEffect } from "react";
import { CourseService } from "../../services/courseService/courseService";
import { ResponseModel } from "../../services/apiService";
import { showConfirm, showMessage } from "../../utils/commonUtil";
import { Link } from "react-router-dom";
import React from "react";

interface PublishCourseComponentProps {
  courseId: number;
  isPublished: boolean;
}

const PublishCourseComponent: React.FC<PublishCourseComponentProps> = ({
  isPublished,
  courseId,
}) => {
  const [loader, setLoader] = useState(false);
  const [coursePublishStatus, setCoursePublishStatus] = useState(isPublished);

  useEffect(() => {
    setCoursePublishStatus(isPublished);
  }, [isPublished]);

  const handlePublishCourse = async (newPublishStatus: boolean) => {
    setLoader(true);

    const courseService = new CourseService();
    let msg =
      newPublishStatus == true
        ? "Are you sure you want to publish this course?"
        : "Are you sure you want to unpublish this course?";
    showConfirm(msg, () => {
      try {
        courseService.publishCourse({
          courseId,
          isPublished: newPublishStatus,
          callback: (res?: ResponseModel) => {
            if (res?.success) {
              setCoursePublishStatus(newPublishStatus);
              showMessage(
                true,
                newPublishStatus
                  ? "Course published successfully"
                  : "Course unpublished successfully"
              );
            }
          },
        });
      } finally {
        setLoader(false);
      }
    });
  };

  return (
    <Card
      title="Publish Your Course"
      className="shadow-lg rounded-2xl text-center p-6"
    >
      <div className="mb-4">
        <label className="block text-sm font-semibold">Status</label>
        <div className="text-gray-500">
          {coursePublishStatus ? "Published" : "Not Published"}
        </div>
      </div>

      {coursePublishStatus ? (
        <Button
          type="primary"
          danger
          size="large"
          className="w-full mt-4"
          onClick={() => handlePublishCourse(false)}
          loading={loader}
        >
          UnPublish Course
        </Button>
      ) : (
        <Button
          type="primary"
          size="large"
          className="w-full mt-4"
          onClick={() => handlePublishCourse(true)}
          loading={loader}
        >
          Publish Course
        </Button>
      )}
    </Card>
  );
};

export default React.memo(PublishCourseComponent);
