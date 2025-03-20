using SharedLib.Model;

namespace API.Course.Model
{
    public class CategoryPaginationRequestModel: PaginationRequestModel
    {
        public bool ShowParentCategoryOnly { get; set; }
        public int? ParentId { get; set; }
    }

    public class CategoryListModel
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public int CategoryId { get; set; }
        public int? ParentId { get; set; }
        public string? ImageUrl { get; set; }
        public string ParentName { get; set; } = string.Empty;
    }

    public class CategoryDeleteModel
    {
        public int id { get; set; }
    }
}
