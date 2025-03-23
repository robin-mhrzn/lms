using API.Course.BLL.IService;
using API.Course.DAL.Context;
using API.Course.Model;
using Microsoft.EntityFrameworkCore;
using SharedLib;
using SharedLib.Model;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace API.Course.BLL.Service
{
    public class CategoryService : ICategoryService
    {
        private readonly CourseContext _context;
        public CategoryService(CourseContext courseContext)
        {
            _context = courseContext;
        }

        public async Task<ResponseModel> SaveCategory(int userId, CategoryModel model)
        {
            if (model.CategoryId == 0)
            {
                var category = new Category
                {
                    Name = model.Name,
                    Description = model.Description,
                    CreatedBy = userId,
                    ImageUrl = model.ImageUrl,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = model.IsActive,
                    ParentId = model.ParentId,
                };
                await _context.Categories.AddAsync(category);
            }
            else
            {
                var category = await _context.Categories.FirstOrDefaultAsync(a => a.CategoryId == model.CategoryId);
                if (category == null)
                {
                    return new ResponseModel(false, "Category not available. Please check again");
                }
                else
                {
                    category.ImageUrl = model.ImageUrl;
                    category.Name = model.Name;
                    category.Description = model.Description;
                    category.IsActive = model.IsActive;
                    category.ParentId = model.ParentId;
                    category.ModifiedBy = userId;
                    category.ModifiedDate = DateTime.UtcNow;
                    _context.Categories.Update(category);
                }
            }
            await _context.SaveChangesAsync();
            return new ResponseModel(true, "Record saved successfully");
        }


        public async Task<ResponseModel> List(CategoryPaginationRequestModel model)
        {
            string parentCategoryName = "";
            if (model.ParentId > 0)
            {
                var category = await _context.Categories.FirstOrDefaultAsync(a => a.CategoryId == model.ParentId);
                parentCategoryName = category == null ? "" : category.Name;
            }
            var query = (from c in _context.Categories
                         where ( c.ParentId == model.ParentId || (model.ParentId==0 && c.ParentId == null))
                         select new CategoryListModel
                         {
                             Name = c.Name,
                             Description = c.Description,
                             IsActive = c.IsActive,
                             CategoryId = c.CategoryId,
                             ParentId = c.ParentId,
                             ImageUrl = c.ImageUrl,
                             ParentName = parentCategoryName
                         }).AsNoTracking();
            switch (model.SortField.ToLower())
            {
                case "name":
                    query = model.SortOrder == SharedEnums.PaginationSortBy.Asc.ToString().ToLower() ? query.OrderBy(a => a.Name) : query.OrderByDescending(a => a.Name);
                    break;
                case "status":
                    query = model.SortOrder == SharedEnums.PaginationSortBy.Asc.ToString().ToLower() ? query.OrderBy(a => a.IsActive) : query.OrderByDescending(a => a.IsActive);
                    break;
                default:
                    query = model.SortOrder == SharedEnums.PaginationSortBy.Asc.ToString().ToLower() ? query.OrderBy(a => a.CategoryId) : query.OrderByDescending(a => a.CategoryId);
                    break;

            }
            foreach (var filter in model.Filters)
            {
                switch (filter.FieldName.ToLower())
                {
                    case "name":
                        query = query.Where(a => a.Name.Contains(filter.FieldValue));
                        break;
                    case "isactive":
                        if (bool.TryParse(filter.FieldValue, out var isActive))
                        {
                            query = query.Where(c => c.IsActive == isActive);
                        }
                        break;
                }
            }
            int total = await query.CountAsync();

            var paginationResponse = new PaginationModel<CategoryListModel>
            {

                PageSize = model.PageSize,
                TotalRecord = total,
                Data = await query
                        .Skip((model.CurrentPage - 1) * model.PageSize)
                        .Take(model.PageSize)
                        .ToListAsync(),
                CurrentPage = model.CurrentPage,
            };
            return new ResponseModel(true, "Success", paginationResponse);
        }

        public async Task<ResponseModel> Delete(int id)
        {
            var categoryEntity = new Category { CategoryId = id };
            _context.Categories.Attach(categoryEntity);
            _context.Categories.Remove(categoryEntity);
            try
            {
                await _context.SaveChangesAsync();
                return new ResponseModel(true, "Record deleted successfully");
            }
            catch (DbUpdateConcurrencyException)
            {
                return new ResponseModel(false, "No record found");
            }
        }

        public async Task<ResponseModel> GetParentCategories()
        {
            var categories = await _context.Categories.Where(a => a.IsActive == true && a.ParentId == null)
                .Select(n => new
                {
                    n.CategoryId,
                    n.Name
                }).OrderBy(a=>a.Name).AsNoTracking().ToListAsync();
            return new ResponseModel(true, "success", categories);
        }
        public async Task<ResponseModel> GetCategories(int parentCategoryId)
        {
            var categories = await _context.Categories.Where(a => a.IsActive == true && a.ParentId == parentCategoryId)
                .Select(n => new
                {
                    n.CategoryId,
                    n.Name
                }).OrderBy(c=>c.Name).AsNoTracking().ToListAsync();
            return new ResponseModel(true, "success", categories);
        }
    }
}
