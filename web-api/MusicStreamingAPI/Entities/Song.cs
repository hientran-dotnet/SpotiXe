using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("ArtistId", Name = "IX_Songs_ArtistId")]
[Index("ArtistId", "Genre", Name = "IX_Songs_Artist_Genre")]
[Index("Genre", Name = "IX_Songs_Genre")]
[Index("Genre", "PlayCount", Name = "IX_Songs_Genre_PlayCount", IsDescending = new[] { false, true })]
[Index("LikeCount", Name = "IX_Songs_LikeCount", AllDescending = true)]
[Index("PlayCount", Name = "IX_Songs_PlayCount", AllDescending = true)]
[Index("ReleaseDate", Name = "IX_Songs_ReleaseDate", AllDescending = true)]
[Index("Title", Name = "IX_Songs_Title")]
public partial class Song
{
    [Key]
    public long SongId { get; set; }

    [StringLength(255)]
    public string Title { get; set; } = null!;

    public int Duration { get; set; }

    public DateOnly? ReleaseDate { get; set; }

    [StringLength(500)]
    public string AudioFileUrl { get; set; } = null!;

    [StringLength(500)]
    public string? StreamingUrl { get; set; }

    [StringLength(500)]
    public string? CoverImageUrl { get; set; }

    public string? Lyrics { get; set; }

    [StringLength(100)]
    public string? Genre { get; set; }

    public long? FileSize { get; set; }

    [StringLength(20)]
    public string? AudioFormat { get; set; }

    public int? Bitrate { get; set; }

    [StringLength(500)]
    public string? LowQualityUrl { get; set; }

    [StringLength(500)]
    public string? MediumQualityUrl { get; set; }

    [StringLength(500)]
    public string? HighQualityUrl { get; set; }

    [StringLength(500)]
    public string? LosslessQualityUrl { get; set; }

    public long? PlayCount { get; set; }

    public long? LikeCount { get; set; }

    public long ArtistId { get; set; }

    public long? AlbumId { get; set; }

    public bool? IsPublic { get; set; }

    public bool? HasCopyright { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public long? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public long? UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public long? DeletedBy { get; set; }

    [ForeignKey("AlbumId")]
    [InverseProperty("Songs")]
    public virtual Album? Album { get; set; }

    [ForeignKey("ArtistId")]
    [InverseProperty("Songs")]
    public virtual Artist Artist { get; set; } = null!;

    [InverseProperty("Song")]
    public virtual ICollection<PlaylistSong> PlaylistSongs { get; set; } = new List<PlaylistSong>();

    [InverseProperty("Song")]
    public virtual ICollection<SongStat> SongStats { get; set; } = new List<SongStat>();

    [InverseProperty("Song")]
    public virtual ICollection<StreamingSession> StreamingSessions { get; set; } = new List<StreamingSession>();

    [InverseProperty("Song")]
    public virtual ICollection<UserFavoriteSong> UserFavoriteSongs { get; set; } = new List<UserFavoriteSong>();

    [InverseProperty("Song")]
    public virtual ICollection<UserListeningHistory> UserListeningHistories { get; set; } = new List<UserListeningHistory>();
}
