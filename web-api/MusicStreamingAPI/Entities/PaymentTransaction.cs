using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("PaymentDate", Name = "IX_Payment_PaymentDate", AllDescending = true)]
[Index("PlanId", Name = "IX_Payment_PlanId")]
[Index("TransactionStatus", Name = "IX_Payment_Status")]
[Index("UserId", Name = "IX_Payment_UserId")]
[Index("UserId", "TransactionStatus", "PaymentDate", Name = "IX_Payment_User_Status", IsDescending = new[] { false, false, true })]
public partial class PaymentTransaction
{
    [Key]
    public long TransactionId { get; set; }

    public long UserId { get; set; }

    public long PlanId { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal Amount { get; set; }

    [StringLength(10)]
    public string? Currency { get; set; }

    [StringLength(50)]
    public string? PaymentMethod { get; set; }

    [StringLength(20)]
    public string? TransactionStatus { get; set; }

    public DateTime? PaymentDate { get; set; }

    [StringLength(255)]
    public string? PaymentGatewayTransactionId { get; set; }

    public string? PaymentGatewayResponse { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [ForeignKey("PlanId")]
    [InverseProperty("PaymentTransactions")]
    public virtual SubscriptionPlan Plan { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("PaymentTransactions")]
    public virtual User User { get; set; } = null!;
}
