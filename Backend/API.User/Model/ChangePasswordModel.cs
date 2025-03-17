using System.ComponentModel.DataAnnotations;

namespace API.User.Model
{
    public class ChangePasswordModel
    {
        [Required(ErrorMessage = "Old Password is required")]
        public string OldPassword { get; set; } = "";
        [Required(ErrorMessage = "New Password is required")]
        public string Password { get; set; } = "";
    }
}
