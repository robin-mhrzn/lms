namespace API.Mailer.BLL.IService
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }
}
