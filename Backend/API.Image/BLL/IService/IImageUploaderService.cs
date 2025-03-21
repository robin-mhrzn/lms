using Microsoft.AspNetCore.Http;
using SharedLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Image.BLL.IService
{
    public interface IImageUploaderService
    {
        Task<ResponseModel> UploadImage(string fileType, IFormFile file);
    }
}
