using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SharedLib.Helper
{
    public  class UserHelper
    {
        public static int GetUserId(ClaimsPrincipal user)
        {
            var userId = user.FindFirstValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
            if (userId == null)
            {
                return 0;
            }
            return Convert.ToInt32(userId);
        }
    }
}
