using System;
using System.Collections.Generic;

namespace API.Course.DAL.Context;

public partial class Lesson
{
    public int LessonId { get; set; }

    public int ModuleId { get; set; }

    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int Duration { get; set; }

    public int Position { get; set; }

    public virtual Module Module { get; set; } = null!;
}
