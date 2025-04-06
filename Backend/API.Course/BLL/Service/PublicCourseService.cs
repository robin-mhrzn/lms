using API.Course.BLL.IService;
using API.Course.DAL.Context;
using API.Course.Model;
using Microsoft.EntityFrameworkCore;
using SharedLib;

namespace API.Course.BLL.Service
{

    public class PublicCourseService : IPublicCourseService
    {
        private readonly CourseContext _context;
        public PublicCourseService(CourseContext context)
        {
            _context = context;
        }

        public async Task<ResponseModel> GetActiveCategories(bool includeSubCategory = true)
        {
            var query = _context.Categories
                .Where(x => x.IsActive && (x.ParentId == 0 || x.ParentId == null))
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
            return new ResponseModel(true, "Success", data);
        }
        public async Task<ResponseModel> GetSubCategories(int categoryId)
        {
            var query = _context.Categories.Where(a => a.ParentId == categoryId)
                .Select(c => new PublicSubCategoryModel
                {
                    CategoryId = c.CategoryId,
                    Name = c.Name,
                    Description = c.Description,
                    ImageUrl = c.ImageUrl
                });
            var data = await query.ToListAsync();
            return new ResponseModel(true, "Success", data);
        }

        public async Task<ResponseModel> GetLanguage()
        {
            var query = _context.Languages.Select(a => new
            {
                LanguageId = a.LanguageId,
                Name = a.Name
            });
            var data = await query.ToListAsync();
            return new ResponseModel(true, "Success", data);
        }

        public async Task<ResponseModel> GetCourseDetail(int courseId)
        {
            var course = await (from c in _context.Courses.Where(a => a.CourseId == courseId && a.IsPublished)
                                join l in _context.Levels on c.LevelId equals l.LevelId
                                join lang in _context.Languages on c.LanguageId equals lang.LanguageId
                                select new
                                {
                                    c.CourseId,
                                    c.Title,
                                    c.Description,
                                    c.Price,
                                    c.BasePrice,
                                    LevelName = l.Name,
                                    c.Duration,
                                    LanguageName = lang.Name,
                                    c.ThumbnailImageUrl,
                                    Tags = c.CourseTags.Select(a => a.Tags.Name).AsEnumerable(),
                                    AdditionalType=(from a in _context.CourseAdditionalTypes
                                                    join ca in _context.CourseAdditionals on a.CourseAdditionalTypeId equals ca.CourseAdditionalTypeId
                                                    where ca.CourseId == c.CourseId
                                                    group new { a, ca } by a.AdditionalType into g
                                                    select new
                                                    {
                                                        AdditionalType = g.Key,
                                                        Items = g.Select(x => x.ca.Description).ToList()
                                                    }).AsEnumerable(),
                                    Modules=(from m in _context.Modules
                                             where m.CourseId==c.CourseId
                                             orderby m.Position
                                             select new
                                             {
                                                 m.ModuleId,
                                                 m.Title,
                                                 m.Description,
                                                 LessonCount=m.Lessons.Count()
                                             }).AsEnumerable()
                                }).FirstOrDefaultAsync();
            return new ResponseModel(true, "Success", course);
        }
    }
}
