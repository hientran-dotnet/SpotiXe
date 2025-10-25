using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Keyless]
public partial class VwPopularPlaylist
{
    public long PlaylistId { get; set; }

    [StringLength(255)]
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    [StringLength(500)]
    public string? CoverImageUrl { get; set; }

    public int? TotalSongs { get; set; }

    public int? TotalDuration { get; set; }

    public long? FollowerCount { get; set; }

    [StringLength(50)]
    public string? PlaylistType { get; set; }

    public long CreatorId { get; set; }

    [StringLength(100)]
    public string CreatorName { get; set; } = null!;

    [StringLength(500)]
    public string? CreatorAvatar { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
