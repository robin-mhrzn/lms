using API.User.BLL.IService;
using API.User.Model;
using Microsoft.AspNetCore.Mvc;

namespace API.User.Controllers
{
    [Route("[controller]")]
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


        [HttpPost("GenerateResetCode")]
        public async Task<IActionResult> GenerateResetPasswordCode([FromBody]EmailModel model)
        {
            return Ok(await _userService.GenerateForgotPwdCode(model.Email));
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody]ResetPasswordModel model)
        {
            return Ok(await _userService.ResetPassword(model));
        }
        [HttpPost("ValidResetCode")]
        public async Task<IActionResult> ValidResetCode([FromBody] OTPModel model)
        {
            return Ok(await _userService.VerifyResetCode(model));
        }
    }
}
