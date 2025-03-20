using API.Image.BLL.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
namespace API.Image.Controllers
{

    [Route("[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IImageUploaderService _imageUploaderService;
        UploadController(IImageUploaderService imageUploaderService)
        {
            _imageUploaderService = imageUploaderService;
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
        {
            return Ok(_imageUploaderService.UploadImage(file));
        }
    }
}
