using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("ArtistId", Name = "IX_Albums_ArtistId")]
[Index("ReleaseDate", Name = "IX_Albums_ReleaseDate", AllDescending = true)]
[Index("Title", Name = "IX_Albums_Title")]
public partial class Album
{
    [Key]
    public long AlbumId { get; set; }

    [StringLength(255)]
    public string Title { get; set; } = null!;

    public DateOnly? ReleaseDate { get; set; }

    [StringLength(500)]
    public string? CoverImageUrl { get; set; }

    public string? Description { get; set; }

    public long ArtistId { get; set; }

    public int? TotalTracks { get; set; }

    public int? TotalDuration { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    [ForeignKey("ArtistId")]
    [InverseProperty("Albums")]
    public virtual Artist Artist { get; set; } = null!;

    [InverseProperty("Album")]
    public virtual ICollection<Song> Songs { get; set; } = new List<Song>();
}
