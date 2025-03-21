using API.Image.BLL.IService;
using API.Image.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("[controller]")]
[Authorize]
public class UploadController : ControllerBase
{
    private readonly IImageUploaderService _imageUploaderService;

    public UploadController(IImageUploaderService imageUploaderService)
    {
        _imageUploaderService = imageUploaderService;
    }

    [HttpPost("image")]
    public async Task<IActionResult> UploadImage([FromForm] UploadModel model)
    {
        if (Request.Form.Files.Count == 0)
        {
            return BadRequest("No file uploaded.");
        }
        var result = await _imageUploaderService.UploadImage(model.FileType,model.File);
        return Ok(result);
    }
}
