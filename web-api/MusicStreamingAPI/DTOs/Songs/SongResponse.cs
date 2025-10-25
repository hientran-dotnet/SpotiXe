namespace MusicStreamingAPI.DTOs.Songs;

public class SongResponse
{
    public long SongId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Duration { get; set; }
    public DateTime? ReleaseDate { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? Genre { get; set; }
    public long PlayCount { get; set; }
    public long LikeCount { get; set; }
    public long ArtistId { get; set; }
    public string ArtistName { get; set; } = string.Empty;
    public long? AlbumId { get; set; }
    public string? AlbumTitle { get; set; }
    public bool IsPublic { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
