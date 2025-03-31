using API.Course.BLL.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Course.Controllers
{
    [AllowAnonymous]
    [Route("[controller]")]
    public class PublicCourseController : Controller
    {
        private readonly IPublicCourseService _publicCourseService;
        public PublicCourseController(IPublicCourseService publicCourseService)
        {
            _publicCourseService = publicCourseService;
        }

        [HttpGet("ActiveCategory")]
        public async Task<IActionResult> GetActiveCategories(bool includeSubCategory)
        {
            return Ok(await _publicCourseService.GetActiveCategories(includeSubCategory));
        }
    }
}
