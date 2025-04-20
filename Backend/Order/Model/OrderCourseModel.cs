namespace API.Order.Model
{
    public class OrderCourseModel
    {
        public int CourseId { get; set; }
        public decimal Price { get; set; }
        public bool IsAlreadyPurchase { get; set; }
    }
}
