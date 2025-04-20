namespace API.User.DAL.Context;

public partial class User
{
    public int UserId { get; set; }

    public string Email { get; set; } = null!;

    public string? Password { get; set; }

    public string Name { get; set; } = null!;

    public int RoleId { get; set; }

    public string LoginType { get; set; } = null!;

    public string? PhoneNo { get; set; }

    public string? ProfilePicUrl { get; set; }

    public string? RefreshToken { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? LastLogin { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public bool IsActive { get; set; }

    public bool Is2Faenabled { get; set; }

    public string? TwoFasecret { get; set; }

    public DateTime? TwoFaverifiedDate { get; set; }

    public string? ResetCode { get; set; }

    public virtual Role Role { get; set; } = null!;
}
