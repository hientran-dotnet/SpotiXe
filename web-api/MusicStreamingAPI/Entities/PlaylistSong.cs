using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("AddedAt", Name = "IX_PlaylistSongs_AddedAt", AllDescending = true)]
[Index("PlaylistId", "Position", Name = "IX_PlaylistSongs_PlaylistId")]
[Index("SongId", Name = "IX_PlaylistSongs_SongId")]
[Index("PlaylistId", "Position", Name = "UQ_Playlist_Position", IsUnique = true)]
public partial class PlaylistSong
{
    [Key]
    public long PlaylistSongId { get; set; }

    public long PlaylistId { get; set; }

    public long SongId { get; set; }

    public int Position { get; set; }

    public DateTime? AddedAt { get; set; }

    public long? AddedBy { get; set; }

    [ForeignKey("AddedBy")]
    [InverseProperty("PlaylistSongs")]
    public virtual User? AddedByNavigation { get; set; }

    [ForeignKey("PlaylistId")]
    [InverseProperty("PlaylistSongs")]
    public virtual Playlist Playlist { get; set; } = null!;

    [ForeignKey("SongId")]
    [InverseProperty("PlaylistSongs")]
    public virtual Song Song { get; set; } = null!;
}
