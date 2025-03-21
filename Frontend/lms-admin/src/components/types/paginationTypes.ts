export interface IPaginationModel {
  currentPage: number;
  pageSize: number;
  Keyword?: string;
  sortField: string;
  sortOrder: string;
  total: number;
  filters: IFilterModel[];
}
export interface IFilterModel {
  fieldName: string;
  fieldValue: string;
}
