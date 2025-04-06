using API.Course.Model;
using SharedLib;

namespace API.Course.BLL.IService
{
    public interface IMeiliSearchService
    {
        Task SyncCourse();
        Task<ResponseModel> GetCourse(PublicCourseRequestModel model);
    }
}
