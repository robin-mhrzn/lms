using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Exceptions;
using SharedLib.Model;
using SharedLib.Model.AppSettings;
using System.Text;

namespace SharedLib.Services
{
    public class RabbitMQPublisher
    {

        public static async Task SendEmailRequest(RabbitMQSettings settings, EmailRequestModel emailRequest)
        {
            var factory = new ConnectionFactory
            {
                HostName = settings.HostName,
                UserName = settings.UserName,
                Password = settings.Password
            };

            try
            {
                using var connection = await factory.CreateConnectionAsync();
                using var channel = await connection.CreateChannelAsync();

                await channel.QueueDeclareAsync(
                    queue: settings.QueueName,
                    durable: false,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);

                var messageJson = JsonConvert.SerializeObject(emailRequest);
                var body = Encoding.UTF8.GetBytes(messageJson);
                await channel.BasicPublishAsync(
                    exchange: "",
                    routingKey: settings.QueueName,
                    body: body);

                Console.WriteLine(" [x] Sent email request to queue.");
            }
            catch (BrokerUnreachableException ex)
            {
                Console.WriteLine($"RabbitMQ broker unreachable: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email request: {ex.Message}");
            }
        }
    }
}
