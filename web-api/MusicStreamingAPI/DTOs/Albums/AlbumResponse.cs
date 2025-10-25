namespace MusicStreamingAPI.DTOs.Albums;

public class AlbumResponse
{
    public long AlbumId { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime? ReleaseDate { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? Description { get; set; }
    public long ArtistId { get; set; }
    public string ArtistName { get; set; } = string.Empty;
    public int TotalTracks { get; set; }
    public int TotalDuration { get; set; } // in seconds
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
