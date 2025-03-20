using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Image.BLL.IService
{
    internal interface IImageUploaderService
    {
        Task<string> UploadImage(IFormFile file);
    }
}
