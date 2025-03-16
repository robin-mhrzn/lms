using API.Mailer.BLL;
using API.Mailer.BLL.IService;
using API.Mailer.BLL.Service;
using API.Mailer.Model.AppSetting;
using SharedLib.Model.AppSettings;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.Configure<RabbitMQSettings>(builder.Configuration.GetSection("RabbitMQSettings"));

builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddHostedService<RabbitMQConsumer>();
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
