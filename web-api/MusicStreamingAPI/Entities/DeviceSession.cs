using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("DeviceToken", Name = "IX_DeviceSession_DeviceToken")]
[Index("IsActive", Name = "IX_DeviceSession_IsActive")]
[Index("LastActivityAt", Name = "IX_DeviceSession_LastActivity", AllDescending = true)]
[Index("UserId", Name = "IX_DeviceSession_UserId")]
[Index("DeviceToken", Name = "UQ__DeviceSe__99E86CC7C060DC43", IsUnique = true)]
public partial class DeviceSession
{
    [Key]
    public long SessionId { get; set; }

    public long UserId { get; set; }

    [StringLength(255)]
    public string DeviceToken { get; set; } = null!;

    [StringLength(50)]
    public string? DeviceType { get; set; }

    public string? DeviceInfo { get; set; }

    [Column("IPAddress")]
    [StringLength(45)]
    public string? Ipaddress { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? LastActivityAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    [InverseProperty("DeviceSession")]
    public virtual ICollection<StreamingSession> StreamingSessions { get; set; } = new List<StreamingSession>();

    [ForeignKey("UserId")]
    [InverseProperty("DeviceSessions")]
    public virtual User User { get; set; } = null!;
}
