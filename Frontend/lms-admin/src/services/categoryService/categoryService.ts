import { IPaginationModel } from "../../components/types/paginationTypes";
import { showMessage } from "../../utils/commonUtil";
import { APIService, ResponseModel } from "../apiService";
export interface ICategoryListRequestModel extends IPaginationModel {
  parentId?: number;
}
export interface ICategoryDataModel {
  key: string;
  name: string;
  description: string;
  isActive: boolean;
  categoryId: number;
  parentId?: number;
  imageUrl: string;
  parentName: string;
}

export class CategoryService {
  private apiService: APIService;
  constructor() {
    this.apiService = new APIService();
  }
  list = ({
    data,
    callback,
  }: {
    data: ICategoryListRequestModel;
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "category/list",
        data: data,
        method: "post",
      })
      .then((res?: any) => {
        callback(res.data as ResponseModel);
      });
  };
  saveCategory = ({
    data,
    callback,
  }: {
    data: ICategoryDataModel;
    callback: (res?: any) => void;
  }) => {
    this.apiService
      .callApi({
        url: "category/add",
        data: data,
        method: "post",
      })
      .then((res?: any) => {
        if (res?.success == true) {
          showMessage(true, "Record saved successfully");
        }
        callback(res.data as ResponseModel);
      });
  };
  deleteCategory = ({
    id,
    callback,
  }: {
    id: number;
    callback: (res?: ResponseModel) => void;
  }) => {
    this.apiService
      .callApi({
        url: "category/delete",
        data: { id: id },
        method: "DELETE",
      })
      .then((res?: any) => {
        if (res?.success == true) {
          showMessage(true, "Record deleted successfully");
        }
        callback(res.data as ResponseModel);
      });
  };
}
