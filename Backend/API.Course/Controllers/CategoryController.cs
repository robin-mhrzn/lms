using API.Course.BLL.IService;
using API.Course.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Course.Controllers
{
    [Route("[controller]")]
    public class CategoryController : AuthBaseController
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            this._categoryService = categoryService;
        }

        [HttpPost("Add")]
        public async Task<IActionResult> AddCategory([FromBody] CategoryModel model)
        {
            return Ok(await this._categoryService.SaveCategory(UserId, model));
        }

        [HttpPost("List")]
        public async Task<IActionResult> List([FromBody] CategoryPaginationRequestModel model)
        {
            return Ok(await this._categoryService.List(model));
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete([FromBody] CategoryDeleteModel model)
        {
            return Ok(await this._categoryService.Delete(model.id));
        }

        [HttpGet("ParentCategory")]
        public async Task<IActionResult> ParentCategory()
        {
            return Ok(await this._categoryService.GetParentCategories());
        }

        [HttpGet("ChildCategory")]
        public async Task<IActionResult> ChildCategory(int parentCategoryId)
        {
            return Ok(await this._categoryService.GetCategories(parentCategoryId));
        }
    }
}
