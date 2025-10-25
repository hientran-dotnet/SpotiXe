namespace MusicStreamingAPI.DTOs.Artists;

public class ArtistResponse
{
    public long ArtistId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? ProfileImageUrl { get; set; }
    public string? Country { get; set; }
    public int? DebutYear { get; set; }
    public long TotalFollowers { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
