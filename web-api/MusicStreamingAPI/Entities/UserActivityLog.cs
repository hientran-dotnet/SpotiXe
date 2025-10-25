using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("ActivityType", Name = "IX_ActivityLogs_ActivityType")]
[Index("CreatedAt", Name = "IX_ActivityLogs_CreatedAt", AllDescending = true)]
public partial class UserActivityLog
{
    [Key]
    public long LogId { get; set; }

    public long? UserId { get; set; }

    [StringLength(100)]
    public string ActivityType { get; set; } = null!;

    public string? ActivityDetails { get; set; }

    [Column("IPAddress")]
    [StringLength(45)]
    public string? Ipaddress { get; set; }

    [StringLength(500)]
    public string? UserAgent { get; set; }

    public DateTime? CreatedAt { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("UserActivityLogs")]
    public virtual User? User { get; set; }
}
