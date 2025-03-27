import { Card } from "antd";
import React, { useState, useCallback, useEffect } from "react";
import { getImageUrl, showConfirm, showMessage } from "../../utils/commonUtil";
import { FileUploadService } from "../../services/fileUploadService/fileUploadService";
import { ResponseModel } from "../../services/apiService";
import { RcFile } from "antd/es/upload";
import { CourseService } from "../../services/courseService/courseService";

interface CourseThumbnailProps {
  courseId: number;
  thumbnailImage: string;
}

const CourseThumbnailComponent: React.FC<CourseThumbnailProps> = ({
  courseId,
  thumbnailImage,
}) => {
  const fileUploader = new FileUploadService();
  const courseService = new CourseService();
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    if (!preview && thumbnailImage) {
      setPreview(getImageUrl(thumbnailImage));
    }
  }, [thumbnailImage, preview]);
  const handleFileUpload = useCallback(
    (file: RcFile) => {
      fileUploader.uploadImage({
        fileType: "Course",
        file: file,
        callback: (res?: ResponseModel) => {
          if (res?.success) {
            courseService.setCourseThumbnail({
              courseId: courseId,
              thumbnailUrl: res.data,
              callback: (res?: ResponseModel) => {
                if (res?.success) {
                  showMessage(true, "Course thumbnail set successfully");
                  setPreview(URL.createObjectURL(file));
                }
              },
            });
          }
        },
      });
    },
    [courseId, courseService, fileUploader]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] as RcFile;
      if (file) {
        showConfirm(
          "Your thumbnail image will be changed. Are you sure you want to change the image?",
          () => handleFileUpload(file)
        );
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0] as RcFile;
      if (file) {
        showConfirm(
          "Your thumbnail image will be changed. Are you sure you want to change the image?",
          () => handleFileUpload(file)
        );
      }
    },
    [handleFileUpload]
  );

  return (
    <Card title="Thumbnail Image" className="shadow-lg rounded-2xl p-6">
      <div
        className={`w-40 h-40 border-2 ${
          isDragging ? "border-blue-500" : "border-dashed border-gray-300"
        } rounded-lg flex items-center justify-center relative cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label htmlFor="thumbnail-upload" className="absolute inset-0">
          {preview ? (
            <img
              src={preview}
              alt="Thumbnail Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div
              className={`flex flex-col items-center justify-center text-gray-500 ${
                isDragging ? "text-blue-500" : ""
              }`}
            >
              <p>Drag & Drop or Click to Upload</p>
            </div>
          )}
        </label>
        <input
          id="thumbnail-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </Card>
  );
};

export default CourseThumbnailComponent;
