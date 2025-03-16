namespace API.Mailer.Model.AppSetting
{
    public class EmailSettings
    {
        public string UserName { get; set; } = "";
        public string DisplayName { get; set; } = "";
        public string Password { get; set; } = "";
        public string Host { get; set; } = "";
        public int Port { get; set; }
    }
}
