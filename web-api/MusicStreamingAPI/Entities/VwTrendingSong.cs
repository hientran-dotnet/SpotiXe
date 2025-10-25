using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Keyless]
public partial class VwTrendingSong
{
    public long SongId { get; set; }

    [StringLength(255)]
    public string Title { get; set; } = null!;

    public int Duration { get; set; }

    [StringLength(100)]
    public string? Genre { get; set; }

    [StringLength(500)]
    public string? CoverImageUrl { get; set; }

    public long ArtistId { get; set; }

    [StringLength(255)]
    public string ArtistName { get; set; } = null!;

    public long? RecentPlayCount { get; set; }

    public long? RecentUniqueListeners { get; set; }
}
