namespace MusicStreamingAPI.DTOs.Songs;

/// <summary>
/// Lightweight DTO for listing songs (optimized for performance)
/// </summary>
public class SongListDto
{
    public long SongId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Duration { get; set; }
    public DateOnly? ReleaseDate { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? Genre { get; set; }

    // Engagement metrics
    public long PlayCount { get; set; }
    public long LikeCount { get; set; }

    // Artist info (basic)
    public long ArtistId { get; set; }
    public string ArtistName { get; set; } = string.Empty;

    // Album info (basic, optional)
    public long? AlbumId { get; set; }
    public string? AlbumTitle { get; set; }

    // Status
    public bool IsPublic { get; set; }
    public bool IsActive { get; set; }
}
