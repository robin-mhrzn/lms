using API.Course.Model;
using SharedLib;

namespace API.Course.BLL.IService
{
    public interface ICourseService
    {
        Task<ResponseModel> GetCourseLevel();
        Task<ResponseModel> GetLanguage();
        Task<ResponseModel> GetById(int courseId);
        Task<ResponseModel> List(CoursePaginationRequestModel model);
        Task<ResponseModel> SaveCourse(int userId, CourseModel model);
        Task<ResponseModel> PublishCourse(int userId, CoursePublishModel model);
        Task<ResponseModel> SetPricing(int userId, CoursePricingModel model);

        Task<ResponseModel> GetTags(string keyword);
        Task<ResponseModel> SetTags(int courseId, string[] tags);
    }

}
