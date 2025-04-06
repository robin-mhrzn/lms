namespace API.Course.Model
{
    public class MeiliSearchCourseModel
    {
        public int CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int CategoryId { get; set; }

        public string CategoryName { get; set; } = string.Empty;
        public int SubCategoryId { get; set; }
        public string SubCategoryName { get; set; } = string.Empty;


        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? ThumbnailImageUrl { get; set; }
        public int LanguageId { get; set; }
        public string Language { get; set; } = string.Empty;
        public int LevelId { get; set; }
        public string LevelName { get; set; } = string.Empty;
    }

}
