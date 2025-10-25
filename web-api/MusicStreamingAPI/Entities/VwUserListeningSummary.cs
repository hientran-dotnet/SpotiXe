using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Keyless]
public partial class VwUserListeningSummary
{
    public long UserId { get; set; }

    [StringLength(100)]
    public string Username { get; set; } = null!;

    [StringLength(255)]
    public string Email { get; set; } = null!;

    public int? UniqueSongsPlayed { get; set; }

    public int? TotalListens { get; set; }

    public int? TotalMinutesListened { get; set; }

    public int? DeviceTypesUsed { get; set; }

    public DateTime? LastListenedAt { get; set; }

    public int? TotalFavorites { get; set; }

    public int? TotalFollowedArtists { get; set; }
}
