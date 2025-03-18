using System.ComponentModel.DataAnnotations;

namespace API.User.Model
{
    public class ResetPasswordModel
    {
        [Required(ErrorMessage ="Email address is required")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage ="Reset code is required")]
        public string OTP { get; set; }=string.Empty;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;
    }
}
