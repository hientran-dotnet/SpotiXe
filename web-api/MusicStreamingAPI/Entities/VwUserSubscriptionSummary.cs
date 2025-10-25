using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Keyless]
public partial class VwUserSubscriptionSummary
{
    public long UserId { get; set; }

    [StringLength(100)]
    public string Username { get; set; } = null!;

    [StringLength(255)]
    public string Email { get; set; } = null!;

    public int? TotalSubscriptions { get; set; }

    public DateTime? FirstSubscriptionDate { get; set; }

    public DateTime? LatestSubscriptionEndDate { get; set; }

    public int? ActiveSubscriptions { get; set; }

    public int? ExpiredSubscriptions { get; set; }

    public int? CancelledSubscriptions { get; set; }

    [Column(TypeName = "decimal(38, 2)")]
    public decimal? TotalSpent { get; set; }
}
