using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
                var userId = User.FindFirstValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
                if (userId == null)
                {
                    return 0;
                }
                return Convert.ToInt32(userId);
            }
        }
    }
}
