using Microsoft.Extensions.Options;
using SharedLib.Model.AppSettings;

namespace SharedLib.Services
{
    public class EmailTemplateService
    {
        private readonly RabbitMQSettings _rabbitMQSettings;

        public EmailTemplateService(IOptions<RabbitMQSettings> rabbitMQSettings)
        {
            _rabbitMQSettings = rabbitMQSettings.Value;
        }

        public void SendEmail(string subject, string emailTemplatePath, string receiverEmail, Dictionary<string, string> contentList)
        {
            if (File.Exists(emailTemplatePath))
            {
                _ = Task.Run(async () =>
                {
                    // Log the email sending process
                    string emailTemplate = await File.ReadAllTextAsync(emailTemplatePath);

                    foreach (var item in contentList)
                    {
                        emailTemplate = emailTemplate.Replace(item.Key, item.Value);
                    }

                    await RabbitMQPublisher.SendEmailRequest(_rabbitMQSettings, new SharedLib.Model.EmailRequestModel
                    {
                        Body = emailTemplate,
                        Subject = subject,
                        To = receiverEmail
                    });
                });
            }
        }
    }
}
