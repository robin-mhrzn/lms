using System;
using System.Collections.Generic;

namespace API.Course.DAL.Context;

public partial class Tag
{
    public int TagsId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<CourseTag> CourseTags { get; set; } = new List<CourseTag>();
}
