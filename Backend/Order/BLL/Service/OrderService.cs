using API.Course.Model.AppSetting;
using API.Order.BLL.IService;
using API.Order.DAL.Context;
using API.Order.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Options;
using SharedLib;
using SharedLib.Helper;
using SharedLib.Model;
using SharedLib.Model.Webhook;
using Stripe.V2;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace API.Order.BLL.Service
{
    public class OrderService : IOrderService
    {
        private readonly OrderContext _context;
        private readonly IStripeService _stripeService;
        private readonly CourseAPIHelperSetting _apiHelperSetting;

        public OrderService(OrderContext context, IStripeService stripeService, IOptions<CourseAPIHelperSetting> apiHelperSetting)
        {
            _context = context;
            _stripeService = stripeService;
            _apiHelperSetting = apiHelperSetting.Value;
        }

        public async Task<ResponseModel> AddOrder(int userId, OrderModel model)
        {
            try
            {
                var response = await CallWebhook(_apiHelperSetting.WebhookUrl, new WebHoookPayloadModel
                {
                    Name = SharedEnums.WebhookName.CourseCheck.ToString(),
                    Data = new { CourseId = model.CourseId, UserId = userId }
                });

                if (response == null || !response.Success)
                {
                    return response ?? new ResponseModel(false, "Failed to fetch course price check response");
                }

                var orderItem = Newtonsoft.Json.JsonConvert.DeserializeObject<OrderCourseModel>(response.Data.ToString());
                if (orderItem.Price != model.Price)
                {
                    return new ResponseModel(false, "Price doesn't match, please try again");
                }

                if (orderItem.IsAlreadyPurchase)
                {
                    return new ResponseModel(false, "You have already purchased this course.");
                }

                var order = await CreateOrder(userId, model, orderItem.Price);

                var stripeStatus = await _stripeService.Charges(model.Price, model.Token);
                if (stripeStatus.Status == Shared.EnumCollection.StripeStatus.succeeded.ToString())
                {
                    await HandleSuccessfulPayment(order, stripeStatus, userId, model);
                    return new ResponseModel(true, "Course has been added to your account");
                }

                return new ResponseModel(false, "Unable to make payment");
            }
            catch
            {
                return new ResponseModel(false, "Unexpected error occurred. Please try again later");
            }
        }

        private async Task<CoursePayment> CreateOrder(int userId, OrderModel model, decimal price)
        {
            var order = new CoursePayment
            {
                CourseId = model.CourseId,
                CourseName = model.CourseName,
                CreatedDate = DateTime.UtcNow,
                Price = price,
                Status = Shared.EnumCollection.StripeStatus.pending.ToString(),
                UserId = userId,
                IsSynced = false
            };

            _context.CoursePayments.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        private async Task HandleSuccessfulPayment(CoursePayment order, StripeStatusResponse stripeStatus, int userId, OrderModel model)
        {
            await UpdateOrderStatus(order, stripeStatus);
            await CallWebhook(_apiHelperSetting.WebhookUrl, new WebHoookPayloadModel
            {
                Name = SharedEnums.WebhookName.PurchaseCourse.ToString(),
                Data = new { CourseId = model.CourseId, UserId = userId, Amount = model.Price }
            });
            await SyncCourse(order);
        }

        private async Task UpdateOrderStatus(CoursePayment order, StripeStatusResponse response)
        {
            order.Status = response.Status;
            order.TransactionId = response.TransactionId;
            order.ModifiedDate = DateTime.UtcNow;
            _context.CoursePayments.Update(order);
            await _context.SaveChangesAsync();
        }

        private async Task SyncCourse(CoursePayment order)
        {
            if (order != null)
            {
                order.IsSynced = true;
                order.ModifiedDate = DateTime.UtcNow;
                _context.CoursePayments.Update(order);
                await _context.SaveChangesAsync();
            }
        }

        private async Task<ResponseModel> CallWebhook(string url, WebHoookPayloadModel model)
        {
            var restHelper = new RestSharpHelper(_apiHelperSetting.BaseUrl);
            var header = new Dictionary<string, string>
            {
                { "X-API-KEY", _apiHelperSetting.SIGNATURE }
            };
            return await restHelper.PostAsync<ResponseModel>(url, header, model) ?? new ResponseModel(false, "failed");
        }

        public async Task<ResponseModel> IsCoursePurchase(int courseId, int userId)
        {
            var isPurchased = await _context.CoursePayments.AnyAsync(a => a.CourseId == courseId && a.UserId == userId);
            return new ResponseModel(true, "Success", new { IsPurchaseItem = isPurchased });
        }

        public async Task<ResponseModel> GetPurchaseList(int userId, PaymentListRequestModel model)
        {
            var query = _context.CoursePayments
                .Where(a => a.UserId == userId)
                .OrderByDescending(cp => cp.CoursePaymentId)
                .Select(cp => cp.CourseId);

            int total = await query.CountAsync();
            var courseIds = await query.Skip((model.CurrentPage - 1) * model.PageSize)
                .Take(model.PageSize)
                .ToListAsync();

            if (!courseIds.Any())
            {
                return new ResponseModel(true, "No courses found", new PaginationModel<OrderCourseListModel>
                {
                    PageSize = model.PageSize,
                    TotalRecord = total,
                    Data = new List<OrderCourseListModel>(),
                    CurrentPage = model.CurrentPage,
                });
            }

            var courseItem = await CallWebhook(_apiHelperSetting.WebhookUrl, new WebHoookPayloadModel
            {
                Name = SharedEnums.WebhookName.CourseList.ToString(),
                Data = courseIds
            });

            if (courseItem == null || courseItem.Data == null || !courseItem.Success)
            {
                return new ResponseModel(false, "Failed to fetch course list");
            }

            var courseList = Newtonsoft.Json.JsonConvert.DeserializeObject<List<OrderCourseListModel>>(courseItem.Data.ToString() ?? string.Empty);
            if (courseList == null)
            {
                return new ResponseModel(false, "Unexpected error occurred. Please try again later!");
            }

            var paginationResponse = new PaginationModel<OrderCourseListModel>
            {
                PageSize = model.PageSize,
                TotalRecord = total,
                Data = courseList,
                CurrentPage = model.CurrentPage,
            };
            return new ResponseModel(true, "Success", paginationResponse);
        }
        public async Task<ResponseModel> GetPurchaseCourseModule(int userId, int courseId, int moduleId)
        {
            var response = await CallWebhook(_apiHelperSetting.WebhookUrl, new WebHoookPayloadModel
            {
                Name = SharedEnums.WebhookName.PurchaseCourseModuleDetail.ToString(),
                Data = new { CourseId = courseId, UserId = userId, ModuleId = moduleId }
            });
            if (response == null || !response.Success)
            {
                return response ?? new ResponseModel(false, "Failed to fetch course detail");
            }
            return response;
        }
    }
}