namespace API.Order.BLL.IService
{
    public interface IStripeService
    {
        Task<StripeStatusResponse> Charges(decimal amount, string token);
    }

    public class StripeStatusResponse
    {
        public string TransactionId { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;
    }
}
