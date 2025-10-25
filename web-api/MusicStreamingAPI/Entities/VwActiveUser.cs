using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Keyless]
public partial class VwActiveUser
{
    public long UserId { get; set; }

    [StringLength(100)]
    public string Username { get; set; } = null!;

    [StringLength(255)]
    public string Email { get; set; } = null!;

    [StringLength(255)]
    public string? FullName { get; set; }

    [StringLength(100)]
    public string? Country { get; set; }

    public DateTime? LastLoginAt { get; set; }

    [StringLength(7)]
    [Unicode(false)]
    public string UserType { get; set; } = null!;

    public int? ListensLast30Days { get; set; }

    public int? TotalFavorites { get; set; }

    public int? TotalPlaylists { get; set; }
}
