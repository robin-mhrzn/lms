namespace API.Order.Model
{
    public class OrderCourseModel
    {
        public int CourseId { get; set; }
        public decimal Price { get; set; }
        public bool IsAlreadyPurchase { get; set; }
    }

    public class OrderCourseListModel
    {
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
    }


   
}