using API.User.BLL.IService;
using API.User.BLL.Service;
using API.User.DAL.Context;
using API.User.DAL.DataMigration;
using API.User.Model.AppSetting;
using API.User.Shared;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SharedLib.Filters;
using SharedLib.Model.AppSettings;
using SharedLib.Services;
using System.Text;
var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration; // Define configuration

// Get Connection String
var connectionString = configuration.GetConnectionString("DefaultConnection");

// Configure Database Context
builder.Services.AddDbContext<UserContext>(options =>
    options.UseSqlServer(connectionString));

// Add Services
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped<RabbitMQPublisher>();
builder.Services.Configure<RabbitMQSettings>(builder.Configuration.GetSection("RabbitMQSettings"));
builder.Services.Configure<OTPConfigSetting>(builder.Configuration.GetSection("OTPConfig"));
builder.Services.Configure<JwtConfigSetting>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddControllers(options =>
{
    options.Filters.Add<CustomValidationFilter>();
});
builder.Services.AddEndpointsApiExplorer();

// Swagger Configuration
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "AuthService",
        Version = "v1"
    });
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

// JWT Authentication Configuration
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtSettings = configuration.GetSection("JwtSettings");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["SecretKey"])
            )
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Enable Swagger in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty;
    });
}

// Configure Middleware
app.UseHttpsRedirection();
app.UseAuthentication(); // Ensure authentication is enabled
app.UseAuthorization();
app.MapControllers();
app.UseCors("AllowAll");
RoleMigrate.CreateRoles(app).Wait();

app.Run();
