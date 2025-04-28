import PurchaseCourseComponent from "@/components/course/purchasedCourse/purchasedCourseComponent";
import MainContainer from "@/components/layout/admin/mainContainer";
import { CourseService } from "@/services/courseService/courseService";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const courseService = new CourseService();
  const course = await courseService.getCourseDetail(parseInt(id));
  return (
    <MainContainer
      title="My Purchase"
      content="View your purchased course list."
    >
      <PurchaseCourseComponent course={course}></PurchaseCourseComponent>
    </MainContainer>
  );
}
