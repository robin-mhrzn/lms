using System;
using System.Collections.Generic;

namespace API.Course.DAL.Context;

public partial class Course
{
    public int CourseId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int CategoryId { get; set; }

    public decimal Price { get; set; }

    public decimal BasePrice { get; set; }

    public int LevelId { get; set; }

    public int Duration { get; set; }

    public int LanguageId { get; set; }

    public string? ThumbnailImageUrl { get; set; }

    public bool IsPublished { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedDate { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<CourseAdditional> CourseAdditionals { get; set; } = new List<CourseAdditional>();

    public virtual ICollection<CourseTag> CourseTags { get; set; } = new List<CourseTag>();

    public virtual Language Language { get; set; } = null!;

    public virtual Level Level { get; set; } = null!;

    public virtual ICollection<Module> Modules { get; set; } = new List<Module>();
}
