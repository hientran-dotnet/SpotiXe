using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("FollowedAt", Name = "IX_FollowPlaylist_FollowedAt", AllDescending = true)]
[Index("PlaylistId", Name = "IX_FollowPlaylist_PlaylistId")]
[Index("UserId", Name = "IX_FollowPlaylist_UserId")]
[Index("UserId", "PlaylistId", Name = "UQ_User_Playlist", IsUnique = true)]
public partial class UserFollowedPlaylist
{
    [Key]
    public long FollowId { get; set; }

    public long UserId { get; set; }

    public long PlaylistId { get; set; }

    public DateTime? FollowedAt { get; set; }

    [ForeignKey("PlaylistId")]
    [InverseProperty("UserFollowedPlaylists")]
    public virtual Playlist Playlist { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("UserFollowedPlaylists")]
    public virtual User User { get; set; } = null!;
}
