using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Table("UserListeningHistory")]
[Index("DeviceType", Name = "IX_History_DeviceType")]
[Index("IsCompleted", Name = "IX_History_IsCompleted")]
[Index("ListenedAt", Name = "IX_History_ListenedAt", AllDescending = true)]
[Index("SongId", Name = "IX_History_SongId")]
[Index("SongId", "ListenedAt", Name = "IX_History_Song_Date", IsDescending = new[] { false, true })]
[Index("UserId", Name = "IX_History_UserId")]
[Index("UserId", "ListenedAt", Name = "IX_History_User_Date", IsDescending = new[] { false, true })]
public partial class UserListeningHistory
{
    [Key]
    public long HistoryId { get; set; }

    public long UserId { get; set; }

    public long SongId { get; set; }

    public DateTime? ListenedAt { get; set; }

    public int? DurationListened { get; set; }

    [StringLength(50)]
    public string? DeviceType { get; set; }

    [StringLength(255)]
    public string? DeviceInfo { get; set; }

    [Column("IPAddress")]
    [StringLength(45)]
    public string? Ipaddress { get; set; }

    public bool? IsCompleted { get; set; }

    [ForeignKey("SongId")]
    [InverseProperty("UserListeningHistories")]
    public virtual Song Song { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("UserListeningHistories")]
    public virtual User User { get; set; } = null!;
}
