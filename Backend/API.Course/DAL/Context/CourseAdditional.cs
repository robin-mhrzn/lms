using System;
using System.Collections.Generic;

namespace API.Course.DAL.Context;

public partial class CourseAdditional
{
    public int CourseAdditionalId { get; set; }

    public int CourseId { get; set; }

    public int CourseAdditionalTypeId { get; set; }

    public string Description { get; set; } = null!;

    public virtual Course Course { get; set; } = null!;

    public virtual CourseAdditionalType CourseAdditionalType { get; set; } = null!;
}
