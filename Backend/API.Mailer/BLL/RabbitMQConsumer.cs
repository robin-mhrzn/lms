using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using SharedLib.Model;
using API.Mailer.BLL.IService;
using SharedLib.Model.AppSettings;

namespace API.Mailer.BLL
{
    public class RabbitMQConsumer : BackgroundService
    {
        private readonly IEmailService _emailService;
        private readonly RabbitMQSettings _settings;
        private IConnection? _connection;
        private IChannel? _channel;

        public RabbitMQConsumer(IEmailService emailService, IOptions<RabbitMQSettings> options)
        {
            _emailService = emailService;
            _settings = options.Value;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var factory = new ConnectionFactory
            {
                HostName = _settings.HostName,
                UserName = _settings.UserName,
                Password = _settings.Password
            };

            _connection = await factory.CreateConnectionAsync(stoppingToken);
            _channel = await _connection.CreateChannelAsync();

            await _channel.QueueDeclareAsync(_settings.QueueName, durable: false, exclusive: false, autoDelete: false);

            var consumer = new AsyncEventingBasicConsumer(_channel);
            consumer.ReceivedAsync += Consumer_HandleBasicDeliver;

            await _channel.BasicConsumeAsync(_settings.QueueName, autoAck: false, consumer);
        }

        private async Task Consumer_HandleBasicDeliver(object sender, BasicDeliverEventArgs ea)
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            var emailRequest = JsonSerializer.Deserialize<EmailRequestModel>(message);

            Console.WriteLine($"Received email request for {emailRequest.To}");

            await _emailService.SendEmailAsync(emailRequest.To, emailRequest.Subject, emailRequest.Body);
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            if (_channel != null)
            {
                await _channel.CloseAsync();
                if (_connection != null)
                    await _connection.CloseAsync();
            }
        }
    }
}
