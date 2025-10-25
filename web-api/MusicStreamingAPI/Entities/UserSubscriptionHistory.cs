using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Table("UserSubscriptionHistory")]
[Index("EndDate", Name = "IX_SubHistory_EndDate", AllDescending = true)]
[Index("PlanId", Name = "IX_SubHistory_PlanId")]
[Index("Status", Name = "IX_SubHistory_Status")]
[Index("UserId", Name = "IX_SubHistory_UserId")]
[Index("UserId", "Status", "EndDate", Name = "IX_SubHistory_User_Status", IsDescending = new[] { false, false, true })]
public partial class UserSubscriptionHistory
{
    [Key]
    public long SubscriptionHistoryId { get; set; }

    public long UserId { get; set; }

    public long PlanId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    [StringLength(20)]
    public string? Status { get; set; }

    public string? CancellationReason { get; set; }

    public DateTime? CreatedAt { get; set; }

    [ForeignKey("PlanId")]
    [InverseProperty("UserSubscriptionHistories")]
    public virtual SubscriptionPlan Plan { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("UserSubscriptionHistories")]
    public virtual User User { get; set; } = null!;
}
