using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharedLib;
using SharedLib.Helper;

namespace API.Course.Controllers
{
    [Authorize("Admin")]
    public class AuthBaseController : Controller
    {
        public int UserId
        {
            get
            {
                return UserHelper.GetUserId(User);
            }
        }
    }
}
