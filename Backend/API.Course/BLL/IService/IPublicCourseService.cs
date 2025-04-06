using API.Course.Model;
using SharedLib;

namespace API.Course.BLL.IService
{
    public interface IPublicCourseService
    {
        Task<ResponseModel> GetActiveCategories(bool includeSubCategory);
        Task<ResponseModel> GetSubCategories(int categoryId);
        Task<ResponseModel> GetLanguage();
        Task<ResponseModel> GetCourseDetail(int courseId);
    }
}
