using API.Course.BLL.IService;
using API.Course.DAL.Context;
using API.Course.Model;
using Microsoft.EntityFrameworkCore;
using SharedLib;

namespace API.Course.BLL.Service
{

    public class PublicCourseService:IPublicCourseService
    {
        private readonly CourseContext _context;
        public PublicCourseService(CourseContext context)
        {
            _context = context;
        }

        public async Task<ResponseModel> GetActiveCategories(bool includeSubCategory=true)
        {
            var query = _context.Categories
                .Where(x => x.IsActive && (x.ParentId ==0 || x.ParentId==null))
                .Select(x => new PublicCategoryModel
                {
                    CategoryId = x.CategoryId,
                    Name = x.Name,
                    Description = x.Description,
                    ImageUrl = x.ImageUrl,
                    SubCategories = includeSubCategory
                        ? x.InverseParent
                            .Where(c => c.IsActive)
                            .Select(c => new PublicSubCategoryModel
                            {
                                CategoryId = c.CategoryId,
                                Name = c.Name,
                                Description = c.Description,
                                ImageUrl = c.ImageUrl
                            }).ToList()
                        : new List<PublicSubCategoryModel>()
                });

            var data = await query.ToListAsync();
            return new ResponseModel(true,"Success",data);
        }

    }
}
