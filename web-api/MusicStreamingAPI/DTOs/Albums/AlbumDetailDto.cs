namespace MusicStreamingAPI.DTOs.Albums;

/// <summary>
/// Detailed album DTO with full information
/// </summary>
public class AlbumDetailDto
{
    public long AlbumId { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateOnly? ReleaseDate { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? Description { get; set; }
    public long ArtistId { get; set; }
    public int TotalTracks { get; set; }
    public int TotalDuration { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Related entities
    public ArtistInfo? Artist { get; set; }
    public List<SongInfo>? Tracks { get; set; }

    public class ArtistInfo
    {
        public long ArtistId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
    }

    public class SongInfo
    {
        public long SongId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int Duration { get; set; }
        public string? CoverImageUrl { get; set; }
    }
}
