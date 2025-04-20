using API.Course.Model.AppSetting;
using API.Order.BLL.IService;
using API.Order.BLL.Service;
using API.Order.DAL.Context;
using API.Order.Model.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SharedLib;
using SharedLib.Filters;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Get Connection String
var connectionString = configuration.GetConnectionString("DefaultConnection");

// Configure Database Context
builder.Services.AddDbContext<OrderContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.Configure<StripeSetting>(builder.Configuration.GetSection("StripeSetting"));
builder.Services.Configure<CourseAPIHelperSetting>(builder.Configuration.GetSection("CourseAPIHelper"));

// Add Services
builder.Services.AddScoped<IStripeService, StripeService>();
builder.Services.AddTransient<IOrderService, OrderService>();

builder.Services.AddControllers(options =>
{
    options.Filters.Add<CustomValidationFilter>();
});
builder.Services.AddEndpointsApiExplorer();
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
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(SharedEnums.Role.User.ToString(), policy => policy.RequireRole(SharedEnums.Role.User.ToString()));
});
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "OrderService",
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

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseCors("AllowAll");
app.Run();
