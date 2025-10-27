namespace MusicStreamingAPI.DTOs.Songs;

/// <summary>
/// Complete song response with all details including related entities
/// </summary>
public class SongResponseDto
{
    public long SongId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Duration { get; set; }
    public DateOnly? ReleaseDate { get; set; }
    public string AudioFileUrl { get; set; } = string.Empty;
    public string? StreamingUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? Lyrics { get; set; }
    public string? Genre { get; set; }
    public long? FileSize { get; set; }
    public string? AudioFormat { get; set; }
    public int? Bitrate { get; set; }

    // Quality URLs
    public string? LowQualityUrl { get; set; }
    public string? MediumQualityUrl { get; set; }
    public string? HighQualityUrl { get; set; }
    public string? LosslessQualityUrl { get; set; }

    // Engagement metrics
    public long PlayCount { get; set; }
    public long LikeCount { get; set; }

    // Artist information
    public long ArtistId { get; set; }
    public string ArtistName { get; set; } = string.Empty;
    public string? ArtistProfileImage { get; set; }

    // Album information (optional)
    public long? AlbumId { get; set; }
    public string? AlbumTitle { get; set; }
    public string? AlbumCoverImage { get; set; }

    // Metadata
    public bool IsPublic { get; set; }
    public bool HasCopyright { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
