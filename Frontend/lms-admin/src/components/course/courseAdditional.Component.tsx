import React, { useState } from "react";
import { Card, Col, Row, Tag, Input, Button, Space, message } from "antd";
import {
  ICourseAdditional,
  ICourseAdditionalType,
} from "../../services/courseService/courseService";
import CourseAdditionalItemComponent from "./CourseAdditionalItem.Component";

interface CourseAdditionalComponentProps {
  courseId: number;
  courseAdditional: ICourseAdditional[];
  courseAdditionalType: ICourseAdditionalType[];
}

const CourseAdditionalComponent: React.FC<CourseAdditionalComponentProps> = ({
  courseId,
  courseAdditional,
  courseAdditionalType,
}) => {
  // Grouping additional items by their type
  const groupedAdditional = courseAdditionalType?.map((additionalType) => {
    const relatedAdditional = courseAdditional.filter(
      (additional) =>
        additional.courseAdditionalTypeId ===
        additionalType.courseAdditionalTypeId
    );
    return {
      type: additionalType,
      additional: relatedAdditional,
    };
  });

  return (
    <>
      {groupedAdditional?.map((group, index) => (
        <Card title={group.type.additionalType} className="mb-4!">
          <CourseAdditionalItemComponent
            courseId={courseId}
            additionalType={group.type}
            additionalItems={group.additional}
          />
        </Card>
      ))}
    </>
  );
};

export default CourseAdditionalComponent;
