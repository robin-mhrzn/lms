using System.ComponentModel.DataAnnotations;

namespace API.Course.Model
{
    public class CourseModel
    {
        public int CourseId { get; set; }
        [Required(ErrorMessage ="Title is required")]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; } = string.Empty;
        [Required(ErrorMessage ="Category is required")]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Level is required")]
        public int LevelId { get; set; }
        [Required(ErrorMessage = "Duration is required")]
        public int Duration { get; set; }
        [Required(ErrorMessage = "Language is required")]
        public int LanguageId { get; set; }

    }

    public class CoursePricingModel
    {
        [Required(ErrorMessage ="Course Id is required")]
        public int CourseId { get; set; }
        [Required(ErrorMessage = "Base Price is required")] 
        public decimal BasePrice { get; set; }
        [Required(ErrorMessage = "Price is required")]
        public decimal Price { get; set; }
    }
    public class CoursePublishModel
    {
        public int CourseId { get; set; }
        public bool IsPublished { get; set; }
    }
}
