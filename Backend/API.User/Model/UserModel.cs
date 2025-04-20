using System.ComponentModel.DataAnnotations;

namespace API.User.Model
{
    public class EmailModel
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        public string Email { get; set; } = "";
    }
    public class LoginModel
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        public string Email { get; set; } = "";
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = "";


        public bool IsAdminType { get; set; } = false;
    }

    public class OTPModel: EmailModel
    {
        [Required(ErrorMessage = "OTP is required")]
        public string OTP { get; set; } = "";
    }
    public class UserModel : OTPModel
    {

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = "";


        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; } = null!;


        public string? PhoneNo { get; set; }

        public string? ProfilePicUrl { get; set; }
    }

}
