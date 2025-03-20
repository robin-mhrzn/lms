using API.Course.Model;
using SharedLib;

namespace API.Course.BLL.IService
{
    public interface ICategoryService
    {
        Task<ResponseModel> SaveCategory(int userId, CategoryModel model);
        Task<ResponseModel> List(CategoryPaginationRequestModel model);
        Task<ResponseModel> Delete(int id);
    }
}
