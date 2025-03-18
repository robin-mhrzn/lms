using Microsoft.Extensions.Options;
using SharedLib.Model.AppSettings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace SharedLib.Services
{
    public class EmailTemplateService
    {
        private readonly RabbitMQSettings _rabbitMQSettings;

        public EmailTemplateService(IOptions<RabbitMQSettings> rabbitMQSettings)
        {
            _rabbitMQSettings = rabbitMQSettings.Value;
        }
        public async Task SendEmail(string subject, string emailTemplatePath, string receiverEmail, Dictionary<string, string> contentList)
        {
            Task.Run(async () =>
            {

                if (File.Exists(emailTemplatePath))
                {
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
                }
            });
        }
    }
}
