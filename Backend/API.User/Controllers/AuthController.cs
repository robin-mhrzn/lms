using API.User.BLL.IService;
using API.User.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharedLib;

namespace API.User.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IUserService _userService;
        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("generateOTP")]
        public async Task<IActionResult> GenerateOTP([FromBody]EmailModel model)
        {
            return Ok(await _userService.GenerateEmailOTP(model.Email));
        }

        [HttpPost("validateOTP")]
        public async Task<IActionResult> ValidateOTP([FromBody]OTPModel model)
        {
            return Ok(await _userService.ValidateOTP(model.OTP, model.Email));
        }
        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody]UserModel model)
        {
            return  Ok(await _userService.Signup(model));
        }
       
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            return Ok(await _userService.Login(model));
        }
    }
}
