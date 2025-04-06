namespace API.Course.Model.AppSetting
{
    public class MeiliSearchSetting
    {
        public string Host { get; set; } = string.Empty;
        public string MasterKey { get; set; } = string.Empty;
        public string IndexName { get; set; }
    }
}
