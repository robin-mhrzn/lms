using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharedLib.Helper;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

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
