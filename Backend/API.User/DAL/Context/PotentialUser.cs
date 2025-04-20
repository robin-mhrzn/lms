namespace API.User.DAL.Context;

public partial class PotentialUser
{
    public int PotentialUserId { get; set; }

    public string Email { get; set; } = null!;

    public string Otp { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public DateTime ExpiryDate { get; set; }
}
