using API.Course.BLL.IService;
using API.Course.BLL.Service;
using API.Course.DAL.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SharedLib.Filters;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SharedLib;
using API.Course.DAL.Migrations;
using API.Course.Model.AppSetting;
var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Get Connection String
var connectionString = configuration.GetConnectionString("DefaultConnection");

// Configure Database Context
builder.Services.AddDbContext<CourseContext>(options =>
    options.UseSqlServer(connectionString));


builder.Services.Configure<MeiliSearchSetting>(builder.Configuration.GetSection("MeiliSearchSetting"));
builder.Services.Configure<WebHookSetting>(builder.Configuration.GetSection("WebHook"));


// Add Services
builder.Services.AddTransient<ICategoryService, CategoryService>();
builder.Services.AddTransient<ICourseService, CourseService>();
builder.Services.AddTransient<IPublicCourseService, PublicCourseService>();
builder.Services.AddTransient<IMeiliSearchService, MeiliSearchService>();
builder.Services.AddTransient<IUserCourseService, UserCourseService>();

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
                Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]??"")
            )
        };
    });
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(SharedEnums.Role.Admin.ToString(), policy => policy.RequireRole(SharedEnums.Role.Admin.ToString()));
});
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "CourseService",
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
DataMigration.MigrateData(app);
app.Run();
