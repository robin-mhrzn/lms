namespace SharedLib.Model
{
    public class PaginationRequestModel
    {
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public string Keyword { get; set; } = string.Empty;
        public string SortField { get; set; } = string.Empty;
        public string SortOrder { get; set; } = string.Empty;
        public IEnumerable<PaginationFilterModel> Filters { get; set; } = [];
    }

    public class PaginationFilterModel
    {
        public string FieldName { get; set; } = string.Empty;
        public string FieldValue { get; set; } = string.Empty;
    }

    public class PaginationModel<T> where T : class
    {
        public int TotalRecord { get; set; }
        public int TotalPage
        {
            get => PageSize == 0 ? 0 : (int)Math.Ceiling((double)TotalRecord / PageSize);
        }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public IEnumerable<T> Data { get; set; } = [];
    }
}
