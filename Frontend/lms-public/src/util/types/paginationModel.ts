export class PaginationModel<T> {
  constructor() {
    this.totalRecord = 0;
    this.currentPage = 1;
    this.pageSize = 10;
    this.data = [] as T[];
  }
  totalRecord: number;
  currentPage: number;
  pageSize: number;
  data: T[];
  get totalPage(): number {
    return Math.ceil(this.totalRecord / this.pageSize);
  }
}
