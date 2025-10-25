namespace MusicStreamingAPI.DTOs.Songs;

public class SongStatisticsResponse
{
    public long SongId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ArtistName { get; set; } = string.Empty;
    public long PlayCount { get; set; }
    public long LikeCount { get; set; }
    public long TotalListeningTime { get; set; } // in seconds
    public int UniqueListeners { get; set; }
    public DateTime? LastPlayedAt { get; set; }
}
