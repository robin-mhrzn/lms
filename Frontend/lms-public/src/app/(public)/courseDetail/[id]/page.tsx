import PurchaseComponent from "@/components/course/purchase/purchase.Component";
import NotFoundComponent from "@/components/extras/notFound";
import MainContainer from "@/components/layout/public/mainContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseService } from "@/services/courseService/courseService";
import { getImageUrl } from "@/util/sharedHelper";
import { CheckCircle } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const courseService = new CourseService();
  const course = await courseService.getCourseDetail(parseInt(id));

  return (
    <MainContainer>
      {course ? (
        <>
          <div
            className=" space-y-8 mb-6 p-6 rounded-lg shadow-lg"
            style={{
              background: "linear-gradient(to right, #f9f9f9, #e0f7fa)", // Soft gradient colors
            }}
          >
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={getImageUrl(course.thumbnailImageUrl)}
                alt="Course Thumbnail"
                className="w-full md:w-80 rounded-lg object-cover shadow-md"
              />
              <div className="flex-1 space-y-4">
                <h1 className="text-4xl font-bold text-gray-800">
                  {course.title}
                </h1>
                <div className="flex gap-2 flex-wrap">
                  {course?.tags?.map((tag, index) => (
                    <span
                      key={`tag_${index}`} // Unique key for each tag
                      className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="space-y-1 text-gray-700">
                  <p>
                    <strong>Level:</strong> {course.levelName}
                  </p>
                  <p>
                    <strong>Language:</strong> {course.languageName}
                  </p>
                  <p>
                    <strong>Duration:</strong> {course.duration} minutes
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <div>{course.description}</div>
              <div className="space-y-6 mb-6">
                {course.additionalType
                  .filter((a) => a.additionalType !== "Course Contents")
                  .map((type, index) => (
                    <div
                      className="space-y-6 mb-6"
                      key={`additionalType_${index}`}
                    >
                      <Card className="p-0 gap-3">
                        <CardHeader className="flex flex-row items-center justify-between bg-primary text-white rounded-t-xl p-2">
                          <CardTitle className="">
                            <h5 className="text-lg font-semibold m-0 ">
                              {type.additionalType}
                            </h5>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside">
                            {type.items.map((item, itemIndex) => (
                              <li key={`item_${index}_${itemIndex}`}>{item}</li> // Unique key for each item
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
              </div>

              <Card className="p-0 gap-3">
                <CardHeader className="flex flex-row items-center justify-between bg-primary text-white  rounded-t-xl p-2">
                  <CardTitle className="">
                    <h5 className="text-lg font-semibold m-0 ">Module</h5>
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-6 pb-2 pt-4">
                  <div className="space-y-4">
                    {course.modules.map((lessonPlan, idx) => (
                      <div key={`module_${idx}`}>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <p className="text-blue-600 font-semibold text-sm">
                              {idx + 1}. {lessonPlan.title}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {lessonPlan.description}
                            </p>
                          </div>
                        </div>
                        {idx < course.modules.length - 1 && (
                          <hr className="mt-3" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                <Card className="w-full max-w-sm shadow-xl rounded-2xl">
                  <div className="bg-white p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Plan Your Dream Career
                    </h2>

                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-3xl font-bold text-black">
                        ${course.price}
                      </span>
                      <span className="line-through text-gray-400">
                        ${course.basePrice}
                      </span>
                    </div>
                    <PurchaseComponent
                      courseId={course.courseId}
                      courseTitle={course.title}
                      price={course.price}
                    ></PurchaseComponent>
                    <hr className="mb-4" />
                    {course.additionalType
                      .filter(
                        (type) => type.additionalType === "Course Contents"
                      )
                      .map((type, index) => (
                        <div key={`courseContent_${index}`}>
                          <div className="text-sm text-gray-700 space-y-2 mb-4">
                            {type.items.map((item, itemIndex) => (
                              <div
                                className="flex items-start"
                                key={`content_item_${index}_${itemIndex}`} // Unique key for each content item
                              >
                                <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1" />
                                {item}
                              </div>
                            ))}
                          </div>
                          <hr className="mb-4" />
                        </div>
                      ))}
                    <div className="flex justify-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        f
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-400 font-bold">
                        t
                      </div>
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                        G+
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        in
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </>
      ) : (
        <NotFoundComponent></NotFoundComponent>
      )}
    </MainContainer>
  );
}
