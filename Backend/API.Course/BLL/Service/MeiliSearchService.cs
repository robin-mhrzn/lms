using API.Course.BLL.IService;
using API.Course.DAL.Context;
using API.Course.Model;
using API.Course.Model.AppSetting;
using Meilisearch;
using Microsoft.Extensions.Options;
using SharedLib;
using SharedLib.Model;

namespace API.Course.BLL.Service
{
    public class MeiliSearchService : IMeiliSearchService
    {
        private readonly MeiliSearchSetting _meiliSearchSetting;
        private readonly MeilisearchClient _meiliClient;
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public MeiliSearchService(IOptions<MeiliSearchSetting> meiliSearchSetting, CourseContext context, IServiceScopeFactory serviceScopeFactory)
        {
            _meiliSearchSetting = meiliSearchSetting.Value;
            _meiliClient = new MeilisearchClient(meiliSearchSetting.Value.Host, meiliSearchSetting.Value.MasterKey);
            _serviceScopeFactory = serviceScopeFactory;
        }
        public async Task SyncCourse()
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var _context = scope.ServiceProvider.GetRequiredService<CourseContext>();

                var courses = (from c in _context.Courses.Where(a => a.IsPublished == true)
                               join cat in _context.Categories on c.CategoryId equals cat.CategoryId
                               join pc in _context.Categories on cat.ParentId equals pc.CategoryId
                               join l in _context.Languages on c.LanguageId equals l.LanguageId
                               join lvl in _context.Levels on c.LevelId equals lvl.LevelId
                               select new MeiliSearchCourseModel
                               {
                                   CourseId = c.CourseId,
                                   CategoryId = pc.CategoryId,
                                   CategoryName = pc.Name,
                                   SubCategoryId = cat.CategoryId,
                                   SubCategoryName = cat.Name,
                                   Description = c.Description,
                                   LanguageId = c.LanguageId,
                                   Language = l.Name,
                                   LevelId = c.LevelId,
                                   LevelName = lvl.Name,
                                   Price = c.Price,
                                   ThumbnailImageUrl = c.ThumbnailImageUrl,
                                   Title = c.Title
                               }).ToList();

                var index = _meiliClient.Index(_meiliSearchSetting.IndexName);
                var task = await index.AddDocumentsAsync(courses, "courseId");
                var item = await index.WaitForTaskAsync(task.TaskUid);
                await index.UpdateFilterableAttributesAsync(new[] { "categoryId", "subCategoryId", "title", "languageId", "price" });
                await index.UpdateSortableAttributesAsync(new[] { "price" });
            }
        }

        public async Task<ResponseModel> GetCourse(PublicCourseRequestModel model)
        {
            var index = _meiliClient.Index(_meiliSearchSetting.IndexName);
            var filters = new List<string>();
            if (model.CategoryId > 0)
                filters.Add($"categoryId = {model.CategoryId}");
            if (model.SubCategoryId > 0)
                filters.Add($"subCategoryId = {model.SubCategoryId}");
            if (model.LanguageId > 0)
                filters.Add($"languageId = {model.LanguageId}");
            if (!string.IsNullOrWhiteSpace(model.Price))
            {
                var priceItems = model.Price.Split("-");
                if (priceItems.Length == 2 &&
                    decimal.TryParse(priceItems[0], out var minPrice) &&
                    decimal.TryParse(priceItems[1], out var maxPrice))
                {
                    filters.Add($"price >= {minPrice} AND price <= {maxPrice}");
                }
            }
            var searchQuery = new SearchQuery
            {
                Q = string.IsNullOrWhiteSpace(model.SearchText) ? null : model.SearchText,
                Filter = filters,
                Limit = model.PageSize,
                Offset = (model.PageNum - 1) * model.PageSize,
                Sort = model.SortBy switch
                {
                    "price" => new List<string> { "price:asc" },
                    "priceDesc" => new List<string> { "price:desc" },
                    _ => null
                }
            };
            var searchResults = await index.SearchAsync<MeiliSearchCourseModel>(searchQuery.Q, searchQuery);
            var pagination = new PaginationModel<MeiliSearchCourseModel>
            {
                TotalRecord = ((Meilisearch.SearchResult<API.Course.Model.MeiliSearchCourseModel>)searchResults).EstimatedTotalHits,
                PageSize = model.PageSize,
                CurrentPage = model.PageNum,
                Data = searchResults.Hits
            };
            return new ResponseModel(true, "Success", pagination);
        }

    }
}
