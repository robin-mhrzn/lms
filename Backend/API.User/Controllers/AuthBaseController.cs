using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharedLib.Helper;

namespace API.User.Controllers
{
    [Authorize]
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
