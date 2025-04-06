using API.Course.BLL.IService;
using API.Course.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Course.Controllers
{
    [AllowAnonymous]
    [Route("[controller]")]
    public class PublicCourseController : Controller
    {
        private readonly IPublicCourseService _publicCourseService;
        private readonly IMeiliSearchService _meiliSearchService;
        public PublicCourseController(IPublicCourseService publicCourseService, IMeiliSearchService meiliSearchService)
        {
            _publicCourseService = publicCourseService;
            _meiliSearchService = meiliSearchService;
        }

        [HttpGet("ActiveCategory")]
        public async Task<IActionResult> GetActiveCategories(bool includeSubCategory)
        {
            return Ok(await _publicCourseService.GetActiveCategories(includeSubCategory));
        }

        [HttpGet("SubCategory")]
        public async Task<IActionResult> GetSubCategories(int categoryId)
        {
            return Ok(await _publicCourseService.GetSubCategories(categoryId));
        }

        [HttpGet("Language")]
        public async Task<IActionResult> Language()
        {
            return Ok(await _publicCourseService.GetLanguage());
        }

        [HttpGet("Course")]
        public async Task<IActionResult> GetCourse([FromQuery] PublicCourseRequestModel model)
        {
            var result = await _meiliSearchService.GetCourse(model);
            return Ok(result);
        }
    }
}
