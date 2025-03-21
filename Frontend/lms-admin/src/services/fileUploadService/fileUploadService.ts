import { RcFile } from "antd/es/upload";
import { APIService, ResponseModel } from "../apiService";

export class FileUploadService {
  apiService = new APIService();
  uploadImage = async ({
    fileType,
    file,
    callback,
  }: {
    fileType: string;
    file: RcFile | null;
    callback: (res: ResponseModel) => void;
  }) => {
    try {
      if (file != null) {
        const formData = new FormData();
        formData.append("fileType", fileType);
        formData.append("file", file);
        this.apiService
          .exportApiFileService({
            url: "upload/image",
            data: formData,
          })
          .then((res?: any) => {
            let responseData = res.data as ResponseModel;
            callback(responseData);
          });
      } else {
        callback({ success: true, message: "success" } as ResponseModel);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("File upload failed.");
    }
  };
}
