namespace API.Course.Model
{
    public class PublicCourseModel
    { }

    public class PublicSubCategoryModel
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
    }
    public class PublicCategoryModel:PublicSubCategoryModel
    {
        public IEnumerable<PublicSubCategoryModel> SubCategories { get; set; } = [];
    }
}
