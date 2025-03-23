using System.ComponentModel.DataAnnotations;

namespace API.Course.Model
{
    public class CategoryModel
    {
        public int CategoryId { get; set; }
        [Required(ErrorMessage ="Name is required")]     
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; } = string.Empty;
        public string Description { get; set; }=string.Empty;
        public int? ParentId { get; set; }
        public bool IsActive { get; set; }
        
    }

}
