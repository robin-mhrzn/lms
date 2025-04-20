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
        Task<ResponseModel> GetModuleByCourse(int courseId);
        Task<ResponseModel> GetByModuleId(int moduleId);
         Task<ResponseModel> SaveModule(int userId,ModuleModel model);
        Task<ResponseModel> DeleteModule(int moduleId);
        Task<ResponseModel> SortModule(SortModuleModel model);
        Task<ResponseModel> SortLesson(SortLessonModel model);
        Task<ResponseModel> SetCourseThumbnail(CourseThumbnailModel model);
        Task<ResponseModel> SetAdditionalCourse(CourseAdditionalItemModel model);
        Task<ResponseModel> DeleteAdditionalCourse(int id);
        Task<ResponseModel> CheckCoursePrice(int userId, int courseId);
    }

}
