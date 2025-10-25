using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("ArtistId", Name = "IX_FollowArtist_ArtistId")]
[Index("FollowedAt", Name = "IX_FollowArtist_FollowedAt", AllDescending = true)]
[Index("UserId", Name = "IX_FollowArtist_UserId")]
[Index("UserId", "ArtistId", Name = "UQ_User_Artist", IsUnique = true)]
public partial class UserFollowedArtist
{
    [Key]
    public long FollowId { get; set; }

    public long UserId { get; set; }

    public long ArtistId { get; set; }

    public DateTime? FollowedAt { get; set; }

    [ForeignKey("ArtistId")]
    [InverseProperty("UserFollowedArtists")]
    public virtual Artist Artist { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("UserFollowedArtists")]
    public virtual User User { get; set; } = null!;
}
