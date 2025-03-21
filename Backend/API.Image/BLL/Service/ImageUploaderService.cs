using API.Image.BLL.IService;
using SharedLib;

namespace API.Image.BLL.Service
{
    public class ImageUploaderService : IImageUploaderService
    {
        private readonly string _uploadPath;

        public ImageUploaderService()
        {
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
        }

        public async Task<ResponseModel> UploadImage(string fileType, IFormFile file)
        {
            var currentDate = DateTime.UtcNow;

            var fileDirectory = Path.Combine(fileType, currentDate.Year.ToString(), currentDate.Month.ToString("D2"), currentDate.Day.ToString("D2"));
            var uploadDirectory = Path.Combine(_uploadPath, fileDirectory);
            if (!Directory.Exists(uploadDirectory))
            {
                Directory.CreateDirectory(uploadDirectory);
            }
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadDirectory, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return new ResponseModel(true, "File uploaded successfully", Path.Combine(fileDirectory, fileName));
        }
    }
}
