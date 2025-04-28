using API.Course.BLL.IService;
using API.Course.DAL.Context;
using API.Course.Model;
using Microsoft.AspNetCore.Connections;
using Microsoft.EntityFrameworkCore;
using SharedLib;
using System.Threading.Tasks;

namespace API.Course.BLL.Service
{
    public class UserCourseService : IUserCourseService
    {
        private readonly CourseContext _context;
        public UserCourseService(CourseContext context)
        {
            _context = context;
        }

        public async Task<ResponseModel> AddCourse(UserCourseModel model)
        {
            var course = new UserCourse()
            {
                Amount = model.Amount,
                CourseId = model.CourseId,
                UserId = model.UserId,
                PayDate = DateTime.UtcNow,
            };
            await _context.UserCourses.AddAsync(course);
            await _context.SaveChangesAsync();
            return new ResponseModel(true, "Course added successfully");
        }
        public async Task<ResponseModel> CheckCoursePrice(int userId, int courseId)
        {
            var course = await (from c in _context.Courses.Where(a => a.CourseId == courseId && a.IsPublished == true)
                                join uc in _context.UserCourses on c.CourseId equals uc.CourseId into userCoursesGroup
                                from uc in userCoursesGroup.DefaultIfEmpty()
                                select new
                                {
                                    CourseId = c.CourseId,
                                    Price = c.Price,
                                    IsAlreadyPurchase = uc != null
                                }).FirstOrDefaultAsync();
            return new ResponseModel(true, "Success", course);
        }
        public async Task<ResponseModel> GetPurchaseCourseDetail(int userId, int courseId)
        {
            var isCourse = await CheckCoursePrice(userId, courseId);
            if (isCourse.Data is IDictionary<string, object> courseData && courseData.TryGetValue("IsAlreadyPurchase", out var isAlreadyPurchase) && isAlreadyPurchase is bool alreadyPurchased && alreadyPurchased)
            {
                return new ResponseModel(false, "Please purchase the course first and try again");
            }
            var course = await (from c in _context.Courses.Where(a => a.CourseId == courseId && a.IsPublished)
                                join uc in _context.UserCourses.Where(a => a.UserId == userId) on c.CourseId equals uc.CourseId
                                join cat in _context.Categories on c.CategoryId equals cat.CategoryId
                                join l in _context.Levels on c.LevelId equals l.LevelId
                                join lang in _context.Languages on c.LanguageId equals lang.LanguageId
                                select new
                                {
                                    c.CourseId,
                                    c.Title,
                                    c.Description,
                                    Category = cat.Name,
                                    LevelName = l.Name,
                                    c.Duration,
                                    LanguageName = lang.Name,
                                    c.ThumbnailImageUrl,
                                    Additional = (
                                        from ca in _context.CourseAdditionals.Where(a => a.CourseId == c.CourseId)
                                        join cat in _context.CourseAdditionalTypes on ca.CourseAdditionalTypeId equals cat.CourseAdditionalTypeId
                                        select new
                                        {
                                            Type = cat.AdditionalType,
                                            Description = ca.Description
                                        }).ToList(),
                                    Modules = (from m in _context.Modules.Where(a => a.CourseId == courseId)
                                               orderby m.Position
                                               select new
                                               {
                                                   m.ModuleId,
                                                   m.Title,
                                                   m.Description,
                                                   NoOfLession = _context.Lessons.Where(a => a.ModuleId == m.ModuleId).Count(),
                                               }).ToList(),
                                }).FirstOrDefaultAsync();
            return new ResponseModel(true, "Success", course);
        }

        public async Task<ResponseModel> GetPurchaseCourseModule(WebhookCourseModuleDetailModel model)
        {
            var isCourse = await CheckCoursePrice(model.UserId, model.CourseId);
            if (isCourse.Data is IDictionary<string, object> courseData && courseData.TryGetValue("IsAlreadyPurchase", out var isAlreadyPurchase) && isAlreadyPurchase is bool alreadyPurchased && alreadyPurchased)
            {
                return new ResponseModel(false, "Please purchase the course first and try again");
            }
            var moduleLesson = await (from m in _context.Modules.Where(a => a.CourseId == model.CourseId && a.ModuleId == model.ModuleId)
                                      select new
                                      {
                                          m.ModuleId,
                                          m.Title,
                                          m.Description,
                                          Lesson = (from l in _context.Lessons.Where(a => a.ModuleId == m.ModuleId)
                                                    orderby l.Position
                                                    select new
                                                    {
                                                        l.LessonId,
                                                        l.Title,
                                                        l.Description,
                                                        l.VideoUrl,
                                                        l.Duration,
                                                        l.Position
                                                    }).ToList()
                                      }).FirstOrDefaultAsync();
            if (moduleLesson == null)
                return new ResponseModel(false, "Module not found.");
            return new ResponseModel(true, "success", moduleLesson);
        }
    }
}
