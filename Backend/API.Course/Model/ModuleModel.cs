using System.ComponentModel.DataAnnotations;

namespace API.Course.Model
{
    public class ModuleModel
    {
        public int CourseId { get; set; }
        [Required(ErrorMessage = "Title is required")]
        public int ModuleId { get; set; }
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }
        public IEnumerable<LessonModel> Lessons { get; set; } = [];

    }
    public class LessonModel
    {
        public int LessonId { get; set; }
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = string.Empty;
        public int Duration { get; set; }
        [Required(ErrorMessage = "Video url is required")]
        public string VideoUrl { get; set; } = string.Empty;
    }

    public class SortLessonModel
    {
        public int ModuleId { get; set; }
        public IEnumerable<int> LessonId { get; set; } = [];
    }
    public class SortModuleModel
    {
        public int CourseId { get; set; }
        public IEnumerable<int> ModuleId { get; set; } = [];
    }

    public class CourseThumbnailModel
    {
        public int CourseId { get; set; }
        public string ThumbnailUrl { get; set; } = "";
    }

    public class CourseAdditionalItemModel
    {
        public int CourseId { get; set; }
        public int CourseAdditionalTypeId { get; set; }
        public int CourseAdditionalId { get; set; }
        public string Description { get; set; } = "";
    }

    public class CourseAdditionalDeleteModel
    {
        public int id { get; set; }
    }
}
