using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharedLib.Helper;

namespace API.Order.Controllers
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
