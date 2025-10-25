using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Keyless]
public partial class VwPremiumUsersStat
{
    public long UserId { get; set; }

    [StringLength(100)]
    public string Username { get; set; } = null!;

    [StringLength(255)]
    public string Email { get; set; } = null!;

    [StringLength(255)]
    public string? FullName { get; set; }

    [StringLength(100)]
    public string SubscriptionPlan { get; set; } = null!;

    [Column(TypeName = "decimal(10, 2)")]
    public decimal PlanPrice { get; set; }

    public DateTime? SubscriptionStartDate { get; set; }

    public DateTime? SubscriptionEndDate { get; set; }

    public int? DaysRemaining { get; set; }

    [StringLength(15)]
    [Unicode(false)]
    public string SubscriptionStatus { get; set; } = null!;
}
