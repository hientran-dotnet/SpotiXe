using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("CreatedAt", Name = "IX_ErrorLogs_CreatedAt", AllDescending = true)]
[Index("ErrorType", Name = "IX_ErrorLogs_ErrorType")]
public partial class ErrorLog
{
    [Key]
    public long ErrorLogId { get; set; }

    [StringLength(100)]
    public string? ErrorType { get; set; }

    public string? ErrorMessage { get; set; }

    public string? StackTrace { get; set; }

    public long? UserId { get; set; }

    [StringLength(500)]
    public string? RequestUrl { get; set; }

    [StringLength(10)]
    public string? RequestMethod { get; set; }

    public string? RequestBody { get; set; }

    [Column("IPAddress")]
    [StringLength(45)]
    public string? Ipaddress { get; set; }

    public DateTime? CreatedAt { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("ErrorLogs")]
    public virtual User? User { get; set; }
}
