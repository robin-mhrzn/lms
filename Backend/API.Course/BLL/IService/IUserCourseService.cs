using API.Course.Model;
using SharedLib;

namespace API.Course.BLL.IService
{
    public interface IUserCourseService
    {
        Task<ResponseModel> AddCourse(UserCourseModel model);
        Task<ResponseModel> CheckCoursePrice(int userId, int courseId);
        Task<ResponseModel> GetPurchaseCourseDetail(int userId, int courseId);
        Task<ResponseModel> GetPurchaseCourseModule( WebhookCourseModuleDetailModel model);
    }
}
