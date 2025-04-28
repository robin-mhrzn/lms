import NotFoundComponent from "@/components/extras/notFound";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ICourseDetailModel } from "@/services/courseService/courseService";
import { getImageUrl } from "@/util/sharedHelper";
import { CheckCircle } from "lucide-react";
import PurchasedCourseModuleComponent from "./purchasedCourseModuleComponent";

interface PurchaseComponentProps {
  course: ICourseDetailModel;
}
const PurchaseCourseComponent: React.FC<PurchaseComponentProps> = ({
  course,
}) => {
  return (
    <>
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
              <PurchasedCourseModuleComponent
                courseId={course.courseId}
                modules={course?.modules}
              ></PurchasedCourseModuleComponent>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                <Card className="w-full max-w-sm shadow-xl rounded-2xl">
                  <div className="bg-white p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Let's get going
                    </h2>

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
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </>
      ) : (
        <NotFoundComponent></NotFoundComponent>
      )}
    </>
  );
};
export default PurchaseCourseComponent;
