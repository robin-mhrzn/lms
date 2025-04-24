export class ResponseModel {
  constructor(
    success: boolean = false,
    message: string = "",
    data: any = null
  ) {
    this.success = false;
    this.message = "";
    this.data = null;
  }

  success: boolean;
  message: string;
  data: any;
}
