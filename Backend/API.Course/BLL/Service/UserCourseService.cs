using API.Course.BLL.IService;
using API.Course.DAL.Context;
using API.Course.Model;
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
    }
}
