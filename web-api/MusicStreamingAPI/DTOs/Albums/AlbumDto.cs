namespace MusicStreamingAPI.DTOs.Albums;

/// <summary>
/// Basic album DTO for list views
/// </summary>
public class AlbumDto
{
    public long AlbumId { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateOnly? ReleaseDate { get; set; }
    public string? CoverImageUrl { get; set; }
    public long ArtistId { get; set; }
    public string ArtistName { get; set; } = string.Empty;
    public int TotalTracks { get; set; }
    public int TotalDuration { get; set; }
    public bool IsActive { get; set; }
}
