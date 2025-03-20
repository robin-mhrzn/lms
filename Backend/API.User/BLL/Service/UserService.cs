using API.User.BLL.IService;
using API.User.DAL.Context;
using API.User.Model;
using API.User.Model.AppSetting;
using API.User.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SharedLib;
using SharedLib.Model.AppSettings;
using SharedLib.Services;
using System.Net.Mail;

namespace API.User.BLL.Service
{
    public class UserService : IUserService
    {
        private readonly UserContext _context;
        private readonly JwtHelper _jwtHelper;
        private readonly OTPConfigSetting _otpConfigSetting;
        private readonly EmailTemplateService _emailTemplateService;
        private readonly IWebHostEnvironment _env;

        private string GetEmailTemplatePath()
        {
            return Path.Combine(_env.ContentRootPath, "EmailTemplates");
        }
        public UserService(UserContext context, JwtHelper jwtHelper, IOptions<OTPConfigSetting> otpSettings, EmailTemplateService emailTemplateService, IWebHostEnvironment env)
        {
            _context = context;
            _jwtHelper = jwtHelper;
            _otpConfigSetting = otpSettings.Value;
            _emailTemplateService = emailTemplateService;
            _env = env;
        }
        public async Task<ResponseModel> GenerateEmailOTP(string emailAddress)
        {
            var optGenerator = new OTPGenerator();
            var potentialUser = await _context.PotentialUsers.FirstOrDefaultAsync(a => a.Email == emailAddress);
            if (potentialUser != null)
            {
                potentialUser.Otp = optGenerator.GenerateOTP();
                potentialUser.ExpiryDate = DateTime.UtcNow.AddMinutes(_otpConfigSetting.OTPExpiresAt);
                _context.PotentialUsers.Update(potentialUser);
            }
            else
            {
                potentialUser = new PotentialUser
                {
                    Email = emailAddress,
                    Otp = optGenerator.GenerateOTP(),
                    ExpiryDate = DateTime.UtcNow.AddMinutes(_otpConfigSetting.OTPExpiresAt),
                    CreatedDate = DateTime.UtcNow
                };
                _context.PotentialUsers.Add(potentialUser);
            }
            await _context.SaveChangesAsync();
            var userDictionary = new Dictionary<string, string>
            {
                {"{email}",emailAddress },
                {"otp",potentialUser.Otp }
            };
            await _emailTemplateService.SendEmail("Verify your email", GetEmailTemplatePath() + "/OTPGeneration.html", emailAddress, userDictionary);

            return new ResponseModel(true, "OTP has been sent to your email address");
        }
        public async Task<ResponseModel> ValidateOTP(string otp, string emailAddress)
        {
            var potentialUser = await _context.PotentialUsers.FirstOrDefaultAsync(a => a.Email == emailAddress && a.Otp == otp);
            if (potentialUser == null)
            {
                return new ResponseModel(false, "OTP you have entered is not correct. Please try again");
            }
            if (potentialUser.ExpiryDate < DateTime.UtcNow)
            {
                return new ResponseModel(false, "OTP has been expired. Please generate again and try again");
            }
            return new ResponseModel(true, "OTP has been validated successfully");
        }
        public async Task<ResponseModel> Signup(UserModel model)
        {
            var roleEntity = await _context.Roles.FirstOrDefaultAsync(a => a.Name == SharedEnums.Role.User.ToString());
            if (roleEntity == null)
            {
                return new ResponseModel(false, "Something went wrong. Please contact admin");
            }
            var otpResponse = await ValidateOTP(model.OTP, model.Email);
            if (!otpResponse.Success)
            {
                return otpResponse;
            }
            TransactionScopeHelper.Execute(() =>
            {
                string loginType = EnumCollection.LoginType.Manual.ToString();
                var user = new DAL.Context.User
                {
                    Email = model.Email,
                    Name = model.Name,
                    Password = PasswordHelper.HashPassword(model.Password),
                    PhoneNo = model.PhoneNo,
                    ProfilePicUrl = model.ProfilePicUrl,
                    LoginType = loginType,
                    RoleId = roleEntity.RoleId,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true,
                };
                _context.Users.Add(user);

                var potentialUser = _context.PotentialUsers.FirstOrDefault(a => a.Email == model.Email);
                if (potentialUser != null)
                {
                    _context.PotentialUsers.Remove(potentialUser);
                }
                _context.SaveChanges();
            });
            return new ResponseModel(true, "You are signed up successfully");
        }

        public async Task<ResponseModel> Login(LoginModel model)
        {
            var user = await _context.Users
                .Include(i => i.Role)
                .FirstOrDefaultAsync(a => a.Email == model.Email);

            if (user == null || !PasswordHelper.VerifyPassword(model.Password, user.Password))
                return new ResponseModel(false, "Invalid email or password");
            if (!user.IsActive)
                return new ResponseModel(false, "User not active. Please contact admin");
            if (user.Role.Name == SharedEnums.Role.Admin.ToString() && !model.IsAdminType)
                return new ResponseModel(false, "Invalid email or password");
            else if (user.Role.Name == SharedEnums.Role.User.ToString() && model.IsAdminType)
                return new ResponseModel(false, "Invalid email or password");
            var token = _jwtHelper.GenerateToken(user.UserId, user.Email, user.Role.Name);
            return new ResponseModel(true, "You are logged in successfully",
                new { name = user.Name, email = user.Email, token });
        }

        public async Task<ResponseModel> ChangePassword(int userId, ChangePasswordModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(a => a.UserId == userId);
            if (user == null)
            {
                return new ResponseModel(false, "User not found");
            }
            if (!PasswordHelper.VerifyPassword(model.OldPassword, user.Password))
            {
                return new ResponseModel(false, "Old password is not correct");
            }
            user.Password = PasswordHelper.HashPassword(model.Password);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return new ResponseModel(true, "Password has been changed successfully");
        }

        public async Task<ResponseModel> GenerateForgotPwdCode(string emailAddress)
        {
            var user = await _context.Users.FirstOrDefaultAsync(a => a.Email == emailAddress && a.IsActive == true);
            if (user == null)
            {
                return new ResponseModel(false, "Invalid email Adress. Please check it");
            }
            user.ResetCode = new OTPGenerator().GenerateOTP();
            user.UpdatedDate = DateTime.UtcNow;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            var userDictionary = new Dictionary<string, string>
            {
                {"{name}",user.Name },
                {"{email}",user.Email},
                {"{resetCode}",user.ResetCode }
            };
            await _emailTemplateService.SendEmail("Reset Password Code", GetEmailTemplatePath() + "/ResetPassword.html", emailAddress, userDictionary);
            return new ResponseModel(true, "Reset code has been sent to your email address. Please check your email");
        }
        public async Task<ResponseModel> VerifyResetCode(OTPModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(a => a.Email == model.Email);
            if (user == null)
            {
                return new ResponseModel(false, "Invalid email address. Please check it");
            }
            if (user.ResetCode != model.OTP)
            {
                return new ResponseModel(false, "OTP code is not valid. Please check it");
            }
            return new ResponseModel(true, "OTP is valid");
        }
        public async Task<ResponseModel> ResetPassword(ResetPasswordModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(a => a.Email == model.Email);
            if (user == null)
            {
                return new ResponseModel(false, "Invalid email address. Please check it");
            }
            if (user.ResetCode != model.OTP)
            {
                return new ResponseModel(false, "Invalid code. Please check your email and try again");
            }
            user.Password = PasswordHelper.HashPassword(model.Password);
            user.ResetCode = null;
            user.UpdatedDate = DateTime.UtcNow;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            var userDictionary = new Dictionary<string, string>
            {
                {"{name}",user.Name },
            };
            await _emailTemplateService.SendEmail("Reset Password Code", GetEmailTemplatePath() + "/ResetPasswordSuccess.html", user.Email, userDictionary);

            return new ResponseModel(true, "Password reset successfully");
        }
    }
}
