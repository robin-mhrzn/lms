using System.Security.Principal;

namespace API.Course.Model
{
    public class PublicCourseRequestModel
    {
        public int CategoryId { get; set; }
        public int SubCategoryId { get; set; }
        public int LanguageId { get; set; }
        public string? SearchText { get; set; } = string.Empty;
        public int PageNum { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Price { get; set; }
        public string? SortBy { get; set; }
    }

    public class PublicSubCategoryModel
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
    }
    public class PublicCategoryModel : PublicSubCategoryModel
    {
        public IEnumerable<PublicSubCategoryModel> SubCategories { get; set; } = [];
    }
}
