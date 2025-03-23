using System;
using System.Collections.Generic;

namespace API.Course.DAL.Context;

public partial class Language
{
    public int LanguageId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();
}
