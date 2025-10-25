using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Keyless]
public partial class VwTop100Song
{
    public long SongId { get; set; }

    [StringLength(255)]
    public string Title { get; set; } = null!;

    public int Duration { get; set; }

    public long? PlayCount { get; set; }

    public long? LikeCount { get; set; }

    [StringLength(100)]
    public string? Genre { get; set; }

    [StringLength(500)]
    public string? CoverImageUrl { get; set; }

    public DateOnly? ReleaseDate { get; set; }

    public long ArtistId { get; set; }

    [StringLength(255)]
    public string ArtistName { get; set; } = null!;

    [StringLength(500)]
    public string? ArtistImage { get; set; }

    public long? AlbumId { get; set; }

    [StringLength(255)]
    public string? AlbumTitle { get; set; }

    [StringLength(500)]
    public string? AlbumCoverImage { get; set; }
}
