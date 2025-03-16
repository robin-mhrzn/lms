namespace API.User.Model.AppSetting
{
    public class JwtConfigSetting
    {
        public string SecretKey { get; set; } = "";
        public string Issuer { get; set; } = "";
        public string Audience { get; set; } = "";
        public int ExpiryMinutes { get; set; }
    }
}
