namespace API.Order.Model
{
    public class OrderModel
    {
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Token { get; set; } = string.Empty;
    }
}
