using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Keyless]
public partial class VwTopArtistsByPlay
{
    public long ArtistId { get; set; }

    [StringLength(255)]
    public string Name { get; set; } = null!;

    [StringLength(100)]
    public string? Country { get; set; }

    [StringLength(500)]
    public string? ProfileImageUrl { get; set; }

    public long? TotalFollowers { get; set; }

    public int? TotalSongs { get; set; }

    public long? TotalPlays { get; set; }

    public long? TotalLikes { get; set; }
}
