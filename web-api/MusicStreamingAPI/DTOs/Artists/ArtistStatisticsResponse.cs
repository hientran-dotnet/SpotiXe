namespace MusicStreamingAPI.DTOs.Artists;

public class ArtistStatisticsResponse
{
    public long ArtistId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int TotalSongs { get; set; }
    public int TotalAlbums { get; set; }
    public long TotalFollowers { get; set; }
    public long TotalPlayCount { get; set; }
    public long TotalLikeCount { get; set; }
}
