import { CourseService } from "@/services/courseService/courseService";

const categryListComponent = async () => {
  const courseService = new CourseService();
  const response = await courseService.getCategories(true);

  return (
    <div>
      <h1>Category List</h1>
    </div>
  );
};
export default categryListComponent;
