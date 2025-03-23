using API.Course.DAL.Context;
using SharedLib;

namespace API.Course.DAL.Migrations
{
    public class DataMigration
    {
        private static List<string> languages = new List<string>
        {
            "English","Nepali","Japnese"
        };
        private static List<string> levels = new List<string>
        { "Beginner", "Intermediate", "Advanced" };
        public static async Task MigrateData(IApplicationBuilder app)
        {
            using (var scope = app.ApplicationServices.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var context = scopedServices.GetRequiredService<CourseContext>();

                var languageToAdd = languages
                                     .Where(l => !context.Languages.Any(r => r.Name == l))
                                     .Select(lan => new Language
                                     {
                                         Name = lan.ToString()
                                     })
                                     .ToList();

                if (languageToAdd.Any())
                {
                    context.Languages.AddRange(languageToAdd);
                    context.SaveChanges();
                }

                var levelsToAdd = levels.Where(l=>!context.Levels.Any(r => r.Name == l))
                    .Select(n=>new Level
                    {
                    }).ToList();
                if (levelsToAdd.Any())
                {
                    context.Levels.AddRange(levelsToAdd);
                    context.SaveChanges();
                }
            }
        }
    }
}
