using API.Course.BLL.IService;
using API.Course.DAL.Context;
using API.Course.Model;
using Microsoft.EntityFrameworkCore;
using SharedLib;
using SharedLib.Model;

namespace API.Course.BLL.Service
{
    public class CourseService : ICourseService
    {
        private readonly CourseContext _context;
        private readonly IMeiliSearchService _meiliSearchService;
        public CourseService(CourseContext context, IMeiliSearchService meiliSearchService)
        {
            _context = context;
            _meiliSearchService = meiliSearchService;
        }

        public async Task<ResponseModel> GetCourseLevel()
        {
            var query = await (from l in _context.Levels
                               select new LevelModel
                               {
                                   LevelId = l.LevelId,
                                   Name = l.Name,
                               }).AsNoTracking().ToListAsync();
            return new ResponseModel(true, "success", query);
        }
        public async Task<ResponseModel> GetLanguage()
        {
            var query = await (from l in _context.Languages
                               select new LanguageModel
                               {
                                   LanguageId = l.LanguageId,
                                   Name = l.Name,
                               }).AsNoTracking().ToListAsync();
            return new ResponseModel(true, "success", query);
        }
        public async Task<ResponseModel> List(CoursePaginationRequestModel model)
        {
            var query = (from c in _context.Courses
                         join cat in _context.Categories on c.CategoryId equals cat.CategoryId
                         join pcat in _context.Categories on cat.ParentId equals pcat.CategoryId
                         join l in _context.Languages on c.LanguageId equals l.LanguageId
                         join lvl in _context.Levels on c.LevelId equals lvl.LevelId
                         select new CourseListModel
                         {
                             CategoryName = cat.Name,
                             CourseId = c.CourseId,
                             IsPublished = c.IsPublished,
                             Language = l.Name,
                             Level = l.Name,
                             Name = c.Title,
                             ParentCategoryName = pcat.Name,
                             Price = c.Price
                         }).AsNoTracking();
            query = model.SortField.ToLower() switch
            {
                "name" => model.SortOrder == SharedEnums.PaginationSortBy.Asc.ToString().ToLower() ? query.OrderBy(a => a.Name) : query.OrderByDescending(a => a.Name),
                "ispublished" => model.SortOrder == SharedEnums.PaginationSortBy.Asc.ToString().ToLower() ? query.OrderBy(a => a.IsPublished) : query.OrderByDescending(a => a.IsPublished),
                "parentcategoryname" => model.SortOrder == SharedEnums.PaginationSortBy.Asc.ToString().ToLower() ? query.OrderBy(a => a.ParentCategoryName) : query.OrderByDescending(a => a.ParentCategoryName),
                "categoryname" => model.SortOrder == SharedEnums.PaginationSortBy.Asc.ToString().ToLower() ? query.OrderBy(a => a.CategoryName) : query.OrderByDescending(a => a.CategoryName),
                "language" => model.SortOrder == SharedEnums.PaginationSortBy.Asc.ToString().ToLower() ? query.OrderBy(a => a.Language) : query.OrderByDescending(a => a.Language),
                _ => model.SortOrder == SharedEnums.PaginationSortBy.Asc.ToString().ToLower() ? query.OrderBy(a => a.CourseId) : query.OrderByDescending(a => a.CourseId),
            };
            foreach (var filter in model.Filters)
            {
                switch (filter.FieldName.ToLower())
                {
                    case "name":
                        query = query.Where(a => a.Name.Contains(filter.FieldValue));
                        break;
                    case "parentcategoryname":
                        query = query.Where(a => a.ParentCategoryName.Contains(filter.FieldValue));
                        break;

                    case "categoryname":
                        query = query.Where(a => a.CategoryName.Contains(filter.FieldValue));
                        break;
                    case "language":
                        query = query.Where(a => a.Language.Contains(filter.FieldValue));
                        break;

                    case "ispublished":
                        if (bool.TryParse(filter.FieldValue, out var ispublished))
                        {
                            query = query.Where(c => c.IsPublished == ispublished);
                        }
                        break;
                }
            }
            int total = await query.CountAsync();

            var paginationResponse = new PaginationModel<CourseListModel>
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

        public async Task<ResponseModel> SaveCourse(int userId, CourseModel model)
        {
            if (model.CourseId == 0)

            {
                var course = new DAL.Context.Course
                {
                    Title = model.Title,
                    CategoryId = model.CategoryId,
                    LevelId = model.LevelId,
                    Description = model.Description,
                    Duration = model.Duration,
                    LanguageId = model.LanguageId,
                    CreatedBy = userId,
                    CreatedDate = DateTime.UtcNow,
                    IsPublished = false,
                };
                await _context.Courses.AddAsync(course);
                await _context.SaveChangesAsync();
            }
            else
            {
                var courseEntity = _context.Courses.FirstOrDefault(a => a.CourseId == model.CourseId);
                if (courseEntity == null)
                {
                    return new ResponseModel(false, "Course not available. Please check it again");
                }
                if (courseEntity.IsPublished)
                {
                    return new ResponseModel(false, "Course already published. Please unpublish the course first");
                }
                courseEntity.Title = model.Title;
                courseEntity.CategoryId = model.CategoryId;
                courseEntity.Description = model.Description;
                courseEntity.Duration = model.Duration;
                courseEntity.IsPublished = false;
                courseEntity.LevelId = model.LevelId;
                courseEntity.LanguageId = model.LanguageId;
                courseEntity.ModifiedBy = userId;
                courseEntity.ModifiedDate = DateTime.UtcNow;
                _context.Courses.Update(courseEntity);
                await _context.SaveChangesAsync();
            }
            SyncCourse();
            return new ResponseModel(true, "Course saved successfully");
        }

        private void SyncCourse()
        {
            _meiliSearchService.SyncCourse();
        }
        public async Task<ResponseModel> GetById(int courseId)
        {
            var course = await _context.Courses
                  .Where(c => c.CourseId == courseId)
                  .Include(c => c.Category)
                  .Include(c => c.CourseTags)
                      .ThenInclude(ct => ct.Tags)
                  .Include(c => c.CourseAdditionals)
                      .ThenInclude(ca => ca.CourseAdditionalType)
                  .Select(c => new
                  {
                      CategoryId = c.CategoryId,
                      CourseId = c.CourseId,
                      Description = c.Description,
                      Duration = c.Duration,
                      LanguageId = c.LanguageId,
                      LevelId = c.LevelId,
                      Title = c.Title,
                      ParentCategoryId = c.Category.ParentId,
                      BasePrice = c.BasePrice,
                      Price = c.Price,
                      Tags = c.CourseTags.Select(ct => ct.Tags.Name).ToList(),
                      ThumbnailImageUrl = c.ThumbnailImageUrl,
                      IsPublished = c.IsPublished,
                      CourseAdditional = c.CourseAdditionals.Select(ca => new
                      {
                          ca.Description,
                          ca.CourseAdditionalTypeId,
                          ca.CourseAdditionalId
                      }).ToList(),
                      CourseAdditionalTypes = _context.CourseAdditionalTypes
                          .Select(ca => new { ca.CourseAdditionalTypeId, ca.AdditionalType })
                          .ToList()
                  })
                  .FirstOrDefaultAsync();
            return new ResponseModel(true, "success", course);
        }

        public async Task<ResponseModel> PublishCourse(int userId, CoursePublishModel model)
        {
            var courseEntity = await _context.Courses.FirstOrDefaultAsync(a => a.CourseId == model.CourseId);
            if (courseEntity == null)
            {
                return new ResponseModel(false, "Course not available. Please check it again");
            }
            courseEntity.IsPublished = model.IsPublished;
            courseEntity.ModifiedBy = userId;
            courseEntity.ModifiedDate = DateTime.UtcNow;
            _context.Courses.Update(courseEntity);
            await _context.SaveChangesAsync();
            return new ResponseModel(true, model.IsPublished ? "Course published successfully" : "Course unpublished successfully");
        }

        public async Task<ResponseModel> SetPricing(int userId, CoursePricingModel model)
        {
            var courseEntity = await _context.Courses.FirstOrDefaultAsync(a => a.CourseId == model.CourseId);
            if (courseEntity == null)
            {
                return new ResponseModel(false, "Course not available. Please verify it");
            }
            courseEntity.BasePrice = model.BasePrice;
            courseEntity.Price = model.Price;
            _context.Courses.Update(courseEntity);
            await _context.SaveChangesAsync();
            return new ResponseModel(true, "Price set successfully for the course");
        }

        public async Task<ResponseModel> GetTags(string keyword)
        {
            var tags = await (from t in _context.Tags.Where(a => a.Name.Contains(keyword))
                              select t.Name).Take(10).ToArrayAsync();
            return new ResponseModel(true, "Success", tags);
        }


        public async Task<ResponseModel> SetTags(int courseId, string[] tags)
        {
            return await TransactionScopeHelper.ExecuteAsync(async () =>
            {
                var tagsTobeAdded = (from t in tags
                                     join dbTag in _context.Tags
                                     on t equals dbTag.Name into tagGroup
                                     from tg in tagGroup.DefaultIfEmpty()
                                     where tg == null || tg.Name == null
                                     select new Tag
                                     {
                                         Name = t
                                     }).ToList();
                await _context.Tags.AddRangeAsync(tagsTobeAdded);
                await _context.SaveChangesAsync();
                var tagIds = _context.Tags
                                           .Where(a => tags.Contains(a.Name))
                                           .Select(a => a.TagsId)
                                           .ToList();
                var existingCourseTagIds = _context.CourseTags
                                                         .Where(ct => ct.CourseId == courseId)
                                                         .Select(ct => ct.TagsId)
                                                         .ToList();
                var tagsToRemove = existingCourseTagIds.Except(tagIds)
                                                       .Select(tagId => new CourseTag { CourseId = courseId, TagsId = tagId })
                                                       .ToList();
                if (tagsToRemove.Any())
                {
                    _context.CourseTags.RemoveRange(_context.CourseTags.Where(ct => tagsToRemove.Select(t => t.TagsId).Contains(ct.TagsId) && ct.CourseId == courseId));
                }
                var newCourseTags = tagIds.Except(existingCourseTagIds)
                                          .Select(tagId => new CourseTag
                                          {
                                              CourseId = courseId,
                                              TagsId = tagId
                                          }).ToList();
                if (newCourseTags.Any())
                {
                    await _context.CourseTags.AddRangeAsync(newCourseTags);
                }
                await _context.SaveChangesAsync();
                return new ResponseModel(true, "Tags set successfully");
            });

        }


        public async Task<ResponseModel> GetModuleByCourse(int courseId)
        {
            var modules = await (from t in _context.Modules.Where(a => a.CourseId == courseId)
                                 orderby t.Position
                                 select new
                                 {
                                     ModuleId = t.ModuleId,
                                     Name = t.Title,
                                     Description = t.Description,
                                     Lessons = t.Lessons.Count(),
                                     Duration = t.Lessons.Sum(l => (int?)l.Duration) ?? 0
                                 }).ToListAsync();
            return new ResponseModel(true, "Success", modules);
        }

        public async Task<ResponseModel> SaveModule(int userId, ModuleModel model)
        {
            if (model.ModuleId == 0)
                await AddModule(userId, model);
            else
                await UpdateModule(userId, model);

            return new ResponseModel(true, "Module saved successfully");
        }

        public async Task<ResponseModel> GetByModuleId(int moduleId)
        {
            var module = await (from m in _context.Modules.Where(a => a.ModuleId == moduleId)
                                select new ModuleModel
                                {
                                    Title = m.Title,
                                    ModuleId = moduleId,
                                    Description = m.Description,
                                    CourseId = m.CourseId,
                                    Lessons = m.Lessons.OrderBy(a => a.Position).Select(n => new LessonModel
                                    {
                                        Description = n.Description,
                                        Duration = n.Duration,
                                        LessonId = n.LessonId,
                                        Title = n.Title,
                                        VideoUrl = n.VideoUrl
                                    })
                                }).FirstOrDefaultAsync();
            return new ResponseModel(true, "success", module);
        }
        private async Task UpdateModule(int userId, ModuleModel model)
        {
            await TransactionScopeHelper.ExecuteAsync(async () =>
            {
                if (model == null) throw new ArgumentNullException(nameof(model));
                var module = await _context.Modules
                    .Include(m => m.Lessons)
                    .FirstOrDefaultAsync(m => m.ModuleId == model.ModuleId);
                if (module == null)
                    throw new KeyNotFoundException($"Module with ID {model.ModuleId} not found.");
                module.Title = model.Title;
                module.Description = model.Description;
                var existingLessonIds = module.Lessons.Select(l => l.LessonId).ToList();
                var newLessonIds = model.Lessons.Select(l => l.LessonId).ToList();

                var delLessons = module.Lessons.Where(l => !newLessonIds.Contains(l.LessonId)).ToList();
                foreach (var lesson in delLessons)
                {
                    _context.Lessons.Remove(lesson);
                }
                int position = 0;
                foreach (var lessonModel in model.Lessons)
                {
                    var existingLesson = module.Lessons.FirstOrDefault(l => l.LessonId == lessonModel.LessonId && l.LessonId > 0);
                    if (existingLesson != null)
                    {
                        existingLesson.Title = lessonModel.Title;
                        existingLesson.Description = lessonModel.Description;
                        existingLesson.Duration = lessonModel.Duration;
                        existingLesson.VideoUrl = lessonModel.VideoUrl;
                        existingLesson.Position = position;
                    }
                    else
                    {
                        _context.Lessons.Add(new Lesson
                        {
                            Title = lessonModel.Title,
                            Description = lessonModel.Description,
                            Duration = lessonModel.Duration,
                            VideoUrl = lessonModel.VideoUrl,
                            Position = position,
                            ModuleId = module.ModuleId
                        });
                    }
                    position++;
                }

                await _context.SaveChangesAsync();
            });

        }

        private async Task AddModule(int userId, ModuleModel model)
        {
            int newModulePosition = await _context.Modules
                .Where(m => m.CourseId == model.CourseId)
                .Select(m => (int?)m.Position)
                .MaxAsync() ?? 0;
            newModulePosition++;
            var module = new Module
            {
                CourseId = model.CourseId,
                Description = model.Description,
                Position = newModulePosition,
                Title = model.Title,
                Lessons = model.Lessons.Select((n, index) => new Lesson
                {
                    Description = n.Description,
                    Duration = n.Duration,
                    Position = index + 1,
                    Title = n.Title,
                    VideoUrl = n.VideoUrl,
                }).ToList()
            };
            await _context.Modules.AddAsync(module);
            await _context.SaveChangesAsync();
        }

        public async Task<ResponseModel> DeleteModule(int moduleId)
        {
            await TransactionScopeHelper.ExecuteAsync(async () =>
            {
                var modules = await _context.Modules.Include(a => a.Course).Include(a => a.Lessons).FirstOrDefaultAsync(a => a.ModuleId == moduleId);
                if (modules != null)
                {
                    _context.Lessons.RemoveRange(modules.Lessons);
                    _context.Modules.Remove(modules);
                }
                await _context.SaveChangesAsync();

            });
            return new ResponseModel(true, "Record deleted successfully");

        }

        public async Task<ResponseModel> SortModule(SortModuleModel model)
        {
            var moduleItems = await _context.Modules.Where(a => a.CourseId == model.CourseId).ToListAsync();
            await TransactionScopeHelper.ExecuteAsync(async () =>
            {
                int position = 1;
                foreach (var id in model.ModuleId)
                {
                    var module = moduleItems.FirstOrDefault(a => a.ModuleId == id);
                    if (module != null)
                    {
                        module.Position = position++;
                    }
                }
                _context.Modules.UpdateRange(moduleItems);
                await _context.SaveChangesAsync();
            });
            return new ResponseModel(true, "Module sorted successfully");
        }

        public async Task<ResponseModel> SortLesson(SortLessonModel model)
        {
            var lessonItems = await _context.Lessons.Where(a => a.ModuleId == model.ModuleId).ToListAsync();
            await TransactionScopeHelper.ExecuteAsync(async () =>
            {
                int position = 1;
                foreach (var id in model.LessonId)
                {
                    var lesson = lessonItems.FirstOrDefault(a => a.LessonId == id);
                    if (lesson != null)
                    {
                        lesson.Position = position++;
                    }
                }
                _context.Lessons.UpdateRange(lessonItems);
                await _context.SaveChangesAsync();
            });
            return new ResponseModel(true, "Lesson sorted successfully");
        }

        public async Task<ResponseModel> SetCourseThumbnail(CourseThumbnailModel model)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(A => A.CourseId == model.CourseId);
            if (course == null)
            {
                return new ResponseModel(false, "Course not available. Please try again later");
            }
            course.ThumbnailImageUrl = model.ThumbnailUrl;
            await _context.SaveChangesAsync();
            return new ResponseModel(true, "Thumbnail set succesfully");
        }

        public async Task<ResponseModel> SetAdditionalCourse(CourseAdditionalItemModel model)
        {
            var item = new CourseAdditional();
            if (model.CourseAdditionalId == 0)
            {
                item = new CourseAdditional
                {
                    CourseAdditionalTypeId = model.CourseAdditionalTypeId,
                    CourseId = model.CourseId,
                    Description = model.Description,
                };
                await _context.CourseAdditionals.AddAsync(item);
            }
            else
            {
                item = await _context.CourseAdditionals.FirstOrDefaultAsync(a => a.CourseAdditionalId == model.CourseAdditionalId);
                if (item != null)
                {
                    item.Description = model.Description;
                }
            }
            await _context.SaveChangesAsync();
            return new ResponseModel(true, "Record saved successfully", new { id = item?.CourseAdditionalId });
        }

        public async Task<ResponseModel> DeleteAdditionalCourse(int id)
        {
            var item = new CourseAdditional { CourseAdditionalId = id };
            _context.CourseAdditionals.Attach(item);
            _context.CourseAdditionals.Remove(item);
            await _context.SaveChangesAsync();
            return new ResponseModel(true, "Record deleted successfully");
        }

        public async Task<ResponseModel> CheckCoursePrice(int userId, int courseId)
        {
            var course =await (from c in _context.Courses.Where(a => a.CourseId == courseId && a.IsPublished == true)
                          join uc in _context.UserCourses on c.CourseId equals uc.CourseId into userCoursesGroup
                          from uc in userCoursesGroup.DefaultIfEmpty()
                          select new
                          {
                              CourseId = c.CourseId,
                              Price = c.Price,
                              IsAlreadyPurchase = uc != null
                          }).FirstOrDefaultAsync();
            return new ResponseModel(true, "Success", course);
        }
    }

}
