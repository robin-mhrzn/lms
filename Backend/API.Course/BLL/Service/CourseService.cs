using API.Course.BLL.IService;
using API.Course.DAL.Context;
using API.Course.Model;
using Microsoft.EntityFrameworkCore;
using SharedLib;
using SharedLib.Model;
using static API.Course.Model.CoursePaginationRequestModel;

namespace API.Course.BLL.Service
{
    public class CourseService : ICourseService
    {
        private readonly CourseContext _context;
        public CourseService(CourseContext context)
        {
            _context = context;
        }

        public async Task<ResponseModel> GetCourseLevel()
        {
            var query = await (from l in _context.Levels
                               select new LevelModel
                               {
                                   LevelId = l.LevelId,
                                   Name = l.Name,
                               }).AsNoTracking().ToListAsync();
            return new ResponseModel(true, "success", query);
        }
        public async Task<ResponseModel> GetLanguage()
        {
            var query = await (from l in _context.Languages
                               select new LanguageModel
                               {
                                   LanguageId = l.LanguageId,
                                   Name= l.Name,
                               }).AsNoTracking().ToListAsync();
            return new ResponseModel(true, "success", query);
        }
        public async Task<ResponseModel> List(CoursePaginationRequestModel model)
        {
            var query = (from c in _context.Courses
                         join cat in _context.Categories on c.CategoryId equals cat.CategoryId
                         join pcat in _context.Categories on cat.ParentId equals pcat.CategoryId
                         join l in _context.Languages on c.LanguageId equals l.LanguageId
                         join lvl in _context.Levels on c.LevelId equals lvl.LevelId
                         select new CourseListModel
                         {
                             CategoryName = cat.Name,
                             CourseId = c.CourseId,
                             IsPublished = c.IsPublished,
                             Language=l.Name,
                             Level=l.Name,
                             Name = c.Title,
                             ParentCategoryName = pcat.Name,
                             Price = c.Price
                         }).AsNoTracking();
            switch (model.SortField.ToLower())
            {
                case "name":
                    query = model.SortOrder == SharedEnums.PaginationSortBy.Asc.ToString().ToLower() ? query.OrderBy(a => a.Name) : query.OrderByDescending(a => a.Name);
                    break;
                case "ispublished":
                    query = model.SortOrder == SharedEnums.PaginationSortBy.Asc.ToString().ToLower() ? query.OrderBy(a => a.IsPublished) : query.OrderByDescending(a => a.IsPublished);
                    break;
                case "parentcategoryname":
                    query = model.SortOrder == SharedEnums.PaginationSortBy.Asc.ToString().ToLower() ? query.OrderBy(a => a.ParentCategoryName) : query.OrderByDescending(a => a.ParentCategoryName);
                    break;
                case "categoryname":
                    query = model.SortOrder == SharedEnums.PaginationSortBy.Asc.ToString().ToLower() ? query.OrderBy(a => a.CategoryName) : query.OrderByDescending(a => a.CategoryName);
                    break;
                case "language":
                    query = model.SortOrder == SharedEnums.PaginationSortBy.Asc.ToString().ToLower() ? query.OrderBy(a => a.Language) : query.OrderByDescending(a => a.Language);
                    break;
                default:
                    query = model.SortOrder == SharedEnums.PaginationSortBy.Asc.ToString().ToLower() ? query.OrderBy(a => a.CourseId) : query.OrderByDescending(a => a.CourseId);
                    break;

            }
            foreach (var filter in model.Filters)
            {
                switch (filter.FieldName.ToLower())
                {
                    case "name":
                        query = query.Where(a => a.Name.Contains(filter.FieldValue));
                        break;
                    case "parentcategoryname":
                        query = query.Where(a => a.ParentCategoryName.Contains(filter.FieldValue));
                        break;

                    case "categoryname":
                        query = query.Where(a => a.CategoryName.Contains(filter.FieldValue));
                        break;
                    case "language":
                        query = query.Where(a => a.Language.Contains(filter.FieldValue));
                        break;

                    case "ispublished":
                        if (bool.TryParse(filter.FieldValue, out var ispublished))
                        {
                            query = query.Where(c => c.IsPublished == ispublished);
                        }
                        break;
                }
            }
            int total = await query.CountAsync();

            var paginationResponse = new PaginationModel<CourseListModel>
            {
                PageSize = model.PageSize,
                TotalRecord = total,
                Data = await query
                        .Skip((model.CurrentPage - 1) * model.PageSize)
                        .Take(model.PageSize)
                        .ToListAsync(),
                CurrentPage = model.CurrentPage,
            };
            return new ResponseModel(true, "Success", paginationResponse);
        }

        public async Task<ResponseModel> SaveCourse(int userId, CourseModel model)
        {
            if (model.CourseId == 0)
            
            {
                var course = new DAL.Context.Course
                {
                    Title = model.Title,
                    CategoryId = model.CategoryId,
                    LevelId=model.LevelId,
                    Description = model.Description,
                    Duration = model.Duration,
                    LanguageId=model.LanguageId,
                    CreatedBy = userId,
                    CreatedDate = DateTime.UtcNow,
                    IsPublished = false,
                };
                await _context.Courses.AddAsync(course);
                await _context.SaveChangesAsync();
            }
            else
            {
                var courseEntity = _context.Courses.FirstOrDefault(a => a.CourseId == model.CourseId);
                if (courseEntity == null)
                {
                    return new ResponseModel(false, "Course not available. Please check it again");
                }
                if (courseEntity.IsPublished)
                {
                    return new ResponseModel(false, "Course already published. Please unpublish the course first");
                }
                courseEntity.Title = model.Title;
                courseEntity.CategoryId = model.CategoryId;
                //courseEntity.CourseLevel = model.CourseLevel;
                courseEntity.Description = model.Description;
                courseEntity.Duration = model.Duration;
                courseEntity.IsPublished = false;
                // courseEntity.ThumbnailImageUrl = model.ThumbnailImageUrl;
                // courseEntity.Language = model.Language;
                courseEntity.ModifiedBy = userId;
                courseEntity.ModifiedDate = DateTime.UtcNow;
                _context.Courses.Update(courseEntity);
                await _context.SaveChangesAsync();
            }
            return new ResponseModel(true, "Course saved successfully");
        }

        public async Task<ResponseModel> PublishCourse(int userId, CoursePublishModel model)
        {
            var courseEntity = await _context.Courses.FirstOrDefaultAsync(a => a.CourseId == model.CourseId);
            if (courseEntity == null)
            {
                return new ResponseModel(false, "Course not available. Please check it again");
            }
            courseEntity.IsPublished = true;
            courseEntity.ModifiedBy = userId;
            courseEntity.ModifiedDate = DateTime.UtcNow;
            _context.Courses.Update(courseEntity);
            await _context.SaveChangesAsync();
            return new ResponseModel(false, model.IsPublished ? "Course published successfully" : "Course unpublished successfully");
        }

        public async Task<ResponseModel> SetPricing(int userId, CoursePricingModel model)
        {
            var courseEntity = await _context.Courses.FirstOrDefaultAsync(a => a.CourseId == model.CourseId);
            if (courseEntity == null)
            {
                return new ResponseModel(false, "Course not available. Please verify it");
            }
            courseEntity.BasePrice = model.BasePrice;
            courseEntity.Price = model.Price;
            _context.Courses.Update(courseEntity);
            await _context.SaveChangesAsync();
            return new ResponseModel(true, "Price set successfully for the course");
        }
    }
}
