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

namespace API.User.BLL.Service
{
    public class UserService : IUserService
    {
        private readonly UserContext _context;
        private readonly JwtHelper _jwtHelper;
        private readonly OTPConfigSetting _otpConfigSetting;
        private readonly RabbitMQSettings _rabbitMQSettings;
        public UserService(UserContext context, JwtHelper jwtHelper, IOptions<OTPConfigSetting> otpSettings,IOptions<RabbitMQSettings> rabbitMQSettings)
        {
            _context = context;
            _jwtHelper = jwtHelper;
            _otpConfigSetting = otpSettings.Value;
            _rabbitMQSettings = rabbitMQSettings.Value;
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
            RabbitMQPublisher.SendEmailRequest(_rabbitMQSettings,new SharedLib.Model.EmailRequestModel
            {
                Body = $"Your OTP is {potentialUser.Otp}",
                Subject="OTP",
                To=emailAddress
            });
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
            var roleEntity = await _context.Roles.FirstOrDefaultAsync(a => a.Name == EnumCollection.Role.User.ToString());
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

                var potentialUser =  _context.PotentialUsers.FirstOrDefault(a => a.Email == model.Email);
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
            var user = await _context.Users.Include(i => i.Role).FirstOrDefaultAsync(a => a.Email == model.Email);
            if (user == null)
            {
                return new ResponseModel(false, "Invalid email or password");
            }
            else if (!user.IsActive)
            {
                return new ResponseModel(false, "User not active. Please contact admin");
            }
            else if (!PasswordHelper.VerifyPassword(model.Password, user.Password))
            {
                return new ResponseModel(false, "Invalid email or password");
            }
            var token = _jwtHelper.GenerateToken(user.UserId, user.Email, user.Role.Name);
            return new ResponseModel(true, "You are logged in successfully", new { name = user.Name, email = user.Email, token = token });
        }

    }
}
