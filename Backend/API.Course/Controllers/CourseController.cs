using API.Course.BLL.IService;
using API.Course.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Course.Controllers
{
    [Route("[controller]")]
    public class CourseController : AuthBaseController
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            this._courseService = courseService;
        }

        [HttpGet("Language")]
        public async Task<IActionResult> Language()
        {
            return Ok(await _courseService.GetLanguage());
        }

        [HttpGet("Level")]
        public async Task<IActionResult> Level()
        {
            return Ok(await _courseService.GetCourseLevel());
        }

        [HttpPost("List")]
        public async Task<IActionResult> List([FromBody] CoursePaginationRequestModel model)
        {
            return Ok(await  _courseService.List(model));   
        }
        [HttpPost("Add")]
        public async Task<IActionResult> Add([FromBody]CourseModel model)
        {
            return Ok(await _courseService.SaveCourse(UserId, model));
        }

        [HttpPost("SetPricing")]
        public async Task<IActionResult> SetPricing([FromBody]CoursePricingModel model)
        {
            return Ok(await _courseService.SetPricing(UserId, model));
        }
        [HttpPost("Publish")]
        public async Task<IActionResult> Publish([FromBody] CoursePublishModel model)
        {
            return Ok(await _courseService.PublishCourse(UserId, model));
        }
    }
}
