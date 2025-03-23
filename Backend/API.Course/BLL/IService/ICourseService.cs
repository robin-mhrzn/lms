using API.Course.Model;
using SharedLib;

namespace API.Course.BLL.IService
{
    public interface ICourseService
    {
        Task<ResponseModel> GetCourseLevel();
        Task<ResponseModel> GetLanguage();
        Task<ResponseModel> List(CoursePaginationRequestModel model);
        Task<ResponseModel> SaveCourse(int userId, CourseModel model);
        Task<ResponseModel> PublishCourse(int userId, CoursePublishModel model);
        Task<ResponseModel> SetPricing(int userId, CoursePricingModel model);
    }
}
