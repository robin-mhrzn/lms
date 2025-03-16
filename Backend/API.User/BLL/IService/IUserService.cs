using API.User.Model;
using SharedLib;

namespace API.User.BLL.IService
{
    public interface IUserService
    {
        Task<ResponseModel> Signup(UserModel model);
        Task<ResponseModel> ValidateOTP(string otp, string emailAddress);
        Task<ResponseModel> Login(LoginModel model);
        Task<ResponseModel> GenerateEmailOTP(string emailAddress);

    }
}
