using API.Order.BLL.IService;
using API.Order.Model.Settings;
using Microsoft.Extensions.Options;
using Stripe;

namespace API.Order.BLL.Service
{
    public class StripeService: IStripeService
    {
        private readonly StripeSetting _stripeSetting;
        public StripeService(IOptions<StripeSetting> stripeSetting)
        {
            this._stripeSetting = stripeSetting.Value;
        }

        public async Task<StripeStatusResponse> Charges(decimal amount, string token)
        {
            StripeConfiguration.ApiKey = _stripeSetting.SecretKey;

            var options = new ChargeCreateOptions
            {
                Amount = Convert.ToInt32(amount * 100),
                Currency = "usd",
                Source = token,
            };
            var service = new ChargeService();
            var charges = await service.CreateAsync(options);
            return new StripeStatusResponse
            {
                Status=charges.Status,
                TransactionId=charges.Id
            };
        }
    }
}
