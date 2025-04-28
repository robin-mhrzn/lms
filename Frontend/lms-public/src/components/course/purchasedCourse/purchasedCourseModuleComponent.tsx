"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IModuleModel } from "@/services/courseService/courseService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ICourseModuleItem,
  OrderService,
} from "@/services/orderService/orderService";

interface IPurchasedCourseModuleComponentProps {
  courseId: number;
  modules: IModuleModel[];
}

const PurchasedCourseModuleComponent: React.FC<
  IPurchasedCourseModuleComponentProps
> = ({ modules, courseId }) => {
  const orderService = new OrderService();
  const [selectedModule, setSelectedModule] =
    useState<ICourseModuleItem | null>(null);
  const [currentlyPlayingLesson, setCurrentlyPlayingLesson] = useState<
    string | null
  >(null);

  const handleModuleClick = (module: IModuleModel) => {
    orderService
      .purchasedCourseModuleLessons(courseId, module.moduleId)
      .then((res) => {
        setSelectedModule(res);
        setCurrentlyPlayingLesson(null); // Reset the currently playing lesson when a new module is clicked
      });
  };

  const handleLessonClick = (lessonUrl: string) => {
    setCurrentlyPlayingLesson(lessonUrl); // Set the iframe source to the selected lesson's video URL
  };

  const closeModal = () => {
    setSelectedModule(null);
    setCurrentlyPlayingLesson(null);
  };

  return (
    <>
      <Card className="p-0 gap-3">
        <CardHeader className="flex flex-row items-center justify-between bg-primary text-white rounded-t-xl p-2">
          <CardTitle className="text-lg font-semibold m-0">Modules</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-2 pt-4">
          <div className="space-y-4">
            {modules.map((module, idx) => (
              <div key={`module_${idx}`}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <p
                      className="text-blue-600 font-semibold text-sm cursor-pointer hover:underline"
                      onClick={() => handleModuleClick(module)}
                    >
                      {idx + 1}. {module.title}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {module.description}
                    </p>
                    <div className="text-sm text-gray-700 mt-2">
                      <p>
                        <strong>Total Lessons:</strong> {module.lessonCount}
                      </p>
                    </div>
                  </div>
                </div>
                {idx < modules.length - 1 && <hr className="mt-3" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lesson List with Embedded Video */}
      {selectedModule && (
        <Dialog open={!!selectedModule} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedModule.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedModule.lesson.map((lesson, idx) => (
                <div key={`lesson_${idx}`} className="space-y-2">
                  <div
                    className="flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => handleLessonClick(lesson.videoUrl)}
                  >
                    <p className="text-gray-800">{lesson.title}</p>
                  </div>

                  {currentlyPlayingLesson === lesson.videoUrl && (
                    <div className="mt-4">
                      <div className="aspect-w-16 aspect-h-9">
                        <iframe
                          src={currentlyPlayingLesson}
                          title="Lesson Video"
                          className="w-full h-full rounded-lg"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PurchasedCourseModuleComponent;
