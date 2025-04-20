using SharedLib;

namespace API.Image.BLL.IService
{
    public interface IImageUploaderService
    {
        Task<ResponseModel> UploadImage(string fileType, IFormFile file);
    }
}
