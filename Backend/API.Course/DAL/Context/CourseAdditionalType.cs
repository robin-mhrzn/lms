using System;
using System.Collections.Generic;

namespace API.Course.DAL.Context;

public partial class CourseAdditionalType
{
    public int CourseAdditionalTypeId { get; set; }

    public string AdditionalType { get; set; } = null!;

    public virtual ICollection<CourseAdditional> CourseAdditionals { get; set; } = new List<CourseAdditional>();
}
