using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Keyless]
public partial class VwSongsByGenre
{
    [StringLength(100)]
    public string? Genre { get; set; }

    public int? TotalSongs { get; set; }

    public long? TotalPlays { get; set; }

    public long? TotalLikes { get; set; }

    public int? AvgDuration { get; set; }

    public int? TotalArtists { get; set; }
}
