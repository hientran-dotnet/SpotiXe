using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Keyless]
public partial class VwRevenueSummary
{
    public int? Year { get; set; }

    public int? Month { get; set; }

    [StringLength(30)]
    public string? MonthName { get; set; }

    public int? TotalPayingUsers { get; set; }

    public int? TotalTransactions { get; set; }

    [Column(TypeName = "decimal(38, 2)")]
    public decimal? TotalRevenue { get; set; }

    [Column(TypeName = "decimal(38, 2)")]
    public decimal? TotalRefunds { get; set; }

    public int? FailedTransactions { get; set; }
}
