using API.User.DAL.Context;
using SharedLib;
namespace API.User.DAL.DataMigration;
public class RoleMigrate
{
    public static async Task CreateRoles(IApplicationBuilder app)
    {
        using (var scope = app.ApplicationServices.CreateScope())
        {
            var scopedServices = scope.ServiceProvider;
            var context = scopedServices.GetRequiredService<UserContext>();

            var rolesToAdd = Enum.GetValues(typeof(SharedEnums.Role))
                                 .Cast<SharedEnums.Role>()
                                 .Where(role => !context.Roles.Any(r => r.Name == role.ToString()))
                                 .Select(role => new Role
                                 {
                                     Name = role.ToString()
                                 })
                                 .ToList();

            if (rolesToAdd.Any())
            {
                await context.Roles.AddRangeAsync(rolesToAdd);
                await context.SaveChangesAsync();
            }
        }
    }
}
