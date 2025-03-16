namespace API.User.Shared
{
    public class EnumCollection
    {
        public enum Role
        {
            Admin = 1,
            User = 2
        }

        public enum LoginType
        {
            Manual,
            Google,
            Facebook
        }
    }
}
