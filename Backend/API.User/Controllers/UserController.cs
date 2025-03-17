using API.User.BLL.IService;
using API.User.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.User.Controllers
{
    [Route("[controller]")]

    public class UserController : AuthBaseController
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            return Ok(await _userService.ChangePassword(UserId, model));
        }

    }
}
