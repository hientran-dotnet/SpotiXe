using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("IsActive", Name = "IX_Plans_IsActive")]
[Index("Name", Name = "IX_Plans_Name")]
[Index("Price", Name = "IX_Plans_Price")]
[Index("Name", Name = "UQ__Subscrip__737584F68C58C371", IsUnique = true)]
public partial class SubscriptionPlan
{
    [Key]
    public long PlanId { get; set; }

    [StringLength(100)]
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal Price { get; set; }

    public int DurationDays { get; set; }

    public string? Features { get; set; }

    public int? MaxOfflineDownloads { get; set; }

    [StringLength(20)]
    public string? StreamingQuality { get; set; }

    public bool? IsAdFree { get; set; }

    public bool? CanSkipUnlimited { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [InverseProperty("Plan")]
    public virtual ICollection<PaymentTransaction> PaymentTransactions { get; set; } = new List<PaymentTransaction>();

    [InverseProperty("Plan")]
    public virtual ICollection<UserSubscriptionHistory> UserSubscriptionHistories { get; set; } = new List<UserSubscriptionHistory>();

    [InverseProperty("CurrentPlan")]
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
