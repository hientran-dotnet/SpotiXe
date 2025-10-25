using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("Date", Name = "IX_SongStats_Date", AllDescending = true)]
[Index("PlayCount", Name = "IX_SongStats_PlayCount", AllDescending = true)]
[Index("SongId", "Date", Name = "IX_SongStats_SongId", IsDescending = new[] { false, true })]
[Index("SongId", "Date", Name = "UQ_Song_Date", IsUnique = true)]
public partial class SongStat
{
    [Key]
    public long SongStatId { get; set; }

    public long SongId { get; set; }

    public DateOnly Date { get; set; }

    public long? PlayCount { get; set; }

    public long? UniqueListeners { get; set; }

    public long? SkipCount { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? CompletionRate { get; set; }

    [ForeignKey("SongId")]
    [InverseProperty("SongStats")]
    public virtual Song Song { get; set; } = null!;
}
