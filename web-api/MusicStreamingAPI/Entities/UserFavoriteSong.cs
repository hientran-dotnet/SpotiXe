using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("CreatedAt", Name = "IX_FavSongs_CreatedAt", AllDescending = true)]
[Index("SongId", Name = "IX_FavSongs_SongId")]
[Index("UserId", Name = "IX_FavSongs_UserId")]
[Index("UserId", "SongId", Name = "UQ_User_Song", IsUnique = true)]
public partial class UserFavoriteSong
{
    [Key]
    public long FavoriteId { get; set; }

    public long UserId { get; set; }

    public long SongId { get; set; }

    public DateTime? CreatedAt { get; set; }

    [ForeignKey("SongId")]
    [InverseProperty("UserFavoriteSongs")]
    public virtual Song Song { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("UserFavoriteSongs")]
    public virtual User User { get; set; } = null!;
}
