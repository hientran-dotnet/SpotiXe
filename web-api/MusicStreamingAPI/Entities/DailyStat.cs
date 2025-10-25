using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("Date", Name = "IX_DailyStats_Date", AllDescending = true)]
[Index("Date", Name = "UQ__DailySta__77387D07FAF58C0C", IsUnique = true)]
public partial class DailyStat
{
    [Key]
    public long StatId { get; set; }

    public DateOnly Date { get; set; }

    public long? TotalUsers { get; set; }

    public long? TotalActiveUsers { get; set; }

    public long? TotalPlays { get; set; }

    public long? TotalNewUsers { get; set; }

    public long? TotalPremiumUsers { get; set; }

    [Column(TypeName = "decimal(12, 2)")]
    public decimal? Revenue { get; set; }

    public DateTime? CreatedAt { get; set; }
}
