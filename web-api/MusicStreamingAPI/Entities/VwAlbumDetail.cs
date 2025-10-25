using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Keyless]
public partial class VwAlbumDetail
{
    public long AlbumId { get; set; }

    [StringLength(255)]
    public string Title { get; set; } = null!;

    public DateOnly? ReleaseDate { get; set; }

    [StringLength(500)]
    public string? CoverImageUrl { get; set; }

    public string? Description { get; set; }

    public int? TotalTracks { get; set; }

    public int? TotalDuration { get; set; }

    public long ArtistId { get; set; }

    [StringLength(255)]
    public string ArtistName { get; set; } = null!;

    [StringLength(500)]
    public string? ArtistImage { get; set; }

    public long? TotalPlays { get; set; }

    public long? TotalLikes { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
