using API.Order.Model;
using SharedLib;

namespace API.Order.BLL.IService
{
    public interface IOrderService
    {
        Task<ResponseModel> AddOrder(int userId, OrderModel model);
        Task<ResponseModel> IsCoursePurchase(int courseId, int userId);
        Task<ResponseModel> GetPurchaseList(int userId, PaymentListRequestModel model);
       // Task<ResponseModel> GetPurchaseDetail(int userId, int courseId);
        Task<ResponseModel> GetPurchaseCourseModule(int userId, int courseId, int moduleId);
    }
}
