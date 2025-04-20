using System;
using System.Collections.Generic;

namespace API.Order.DAL.Context;

public partial class CoursePayment
{
    public int CoursePaymentId { get; set; }

    public int UserId { get; set; }

    public int CourseId { get; set; }

    public decimal Price { get; set; }

    public string Status { get; set; } = null!;

    public bool IsSynced { get; set; }

    public string? TransactionId { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }
}
