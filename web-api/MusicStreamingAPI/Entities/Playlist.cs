using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("CreatedAt", Name = "IX_Playlists_CreatedAt", AllDescending = true)]
[Index("Name", Name = "IX_Playlists_Name")]
[Index("PlaylistType", Name = "IX_Playlists_PlaylistType")]
[Index("UserId", Name = "IX_Playlists_UserId")]
public partial class Playlist
{
    [Key]
    public long PlaylistId { get; set; }

    [StringLength(255)]
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    [StringLength(500)]
    public string? CoverImageUrl { get; set; }

    public long UserId { get; set; }

    public bool? IsPublic { get; set; }

    public bool? IsSystemGenerated { get; set; }

    [StringLength(50)]
    public string? PlaylistType { get; set; }

    public int? TotalSongs { get; set; }

    public int? TotalDuration { get; set; }

    public long? FollowerCount { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    [InverseProperty("Playlist")]
    public virtual ICollection<PlaylistSong> PlaylistSongs { get; set; } = new List<PlaylistSong>();

    [ForeignKey("UserId")]
    [InverseProperty("Playlists")]
    public virtual User User { get; set; } = null!;

    [InverseProperty("Playlist")]
    public virtual ICollection<UserFollowedPlaylist> UserFollowedPlaylists { get; set; } = new List<UserFollowedPlaylist>();
}
