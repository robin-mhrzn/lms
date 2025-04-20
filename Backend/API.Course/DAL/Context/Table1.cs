using System;
using System.Collections.Generic;

namespace API.Course.DAL.Context;

public partial class Table1
{
    public int UserCourseId { get; set; }

    public int UserId { get; set; }

    public int CourseId { get; set; }

    public DateTime PayDate { get; set; }

    public decimal Amount { get; set; }

    public virtual Course Course { get; set; } = null!;
}
