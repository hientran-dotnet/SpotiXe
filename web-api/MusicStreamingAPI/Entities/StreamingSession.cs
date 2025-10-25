using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("DeviceSessionId", Name = "IX_Streaming_DeviceSessionId")]
[Index("StreamingQuality", Name = "IX_Streaming_Quality")]
[Index("SessionToken", Name = "IX_Streaming_SessionToken")]
[Index("SongId", Name = "IX_Streaming_SongId")]
[Index("StartTime", Name = "IX_Streaming_StartTime", AllDescending = true)]
[Index("UserId", Name = "IX_Streaming_UserId")]
[Index("SessionToken", Name = "UQ__Streamin__46BDD124A0F19066", IsUnique = true)]
public partial class StreamingSession
{
    [Key]
    public long StreamingSessionId { get; set; }

    public long UserId { get; set; }

    public long SongId { get; set; }

    public long DeviceSessionId { get; set; }

    [StringLength(255)]
    public string SessionToken { get; set; } = null!;

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    [StringLength(20)]
    public string? StreamingQuality { get; set; }

    public long? BytesStreamed { get; set; }

    [ForeignKey("DeviceSessionId")]
    [InverseProperty("StreamingSessions")]
    public virtual DeviceSession DeviceSession { get; set; } = null!;

    [ForeignKey("SongId")]
    [InverseProperty("StreamingSessions")]
    public virtual Song Song { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("StreamingSessions")]
    public virtual User User { get; set; } = null!;
}
