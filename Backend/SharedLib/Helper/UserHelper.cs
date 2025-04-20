using System.Security.Claims;

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
