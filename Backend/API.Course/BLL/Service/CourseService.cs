using API.Course.BLL.IService;
using API.Course.DAL.Context;
using API.Course.Model;
using Microsoft.EntityFrameworkCore;
using SharedLib;

namespace API.Course.BLL.Service
{
    public class CourseService:ICourseService
    {
        private readonly CourseContext _context;
        public CourseService(CourseContext context)
        {
            _context = context;
        }

     
    }
}
