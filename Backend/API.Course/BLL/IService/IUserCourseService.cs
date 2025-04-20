using API.Course.Model;
using SharedLib;

namespace API.Course.BLL.IService
{
    public interface IUserCourseService
    {
        Task<ResponseModel> AddCourse(UserCourseModel model);
    }
}
