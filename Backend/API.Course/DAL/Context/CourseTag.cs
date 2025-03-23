using System;
using System.Collections.Generic;

namespace API.Course.DAL.Context;

public partial class CourseTag
{
    public int CourseTagsId { get; set; }

    public int CourseId { get; set; }

    public int TagsId { get; set; }

    public virtual Course Course { get; set; } = null!;

    public virtual Tag Tags { get; set; } = null!;
}
