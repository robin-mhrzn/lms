using SharedLib.Model;

namespace API.Course.Model
{
    public class CoursePaginationRequestModel : PaginationRequestModel
    {
    }

    public class CourseListModel
    {
        public int CourseId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Language { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string ParentCategoryName { get; set; } = string.Empty;
        public bool IsPublished { get; set; }
    }
}
