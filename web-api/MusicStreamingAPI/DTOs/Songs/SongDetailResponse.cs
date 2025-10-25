namespace MusicStreamingAPI.DTOs.Songs;

public class SongDetailResponse : SongResponse
{
    public string StreamingUrl { get; set; } = string.Empty;
    public string? Lyrics { get; set; }
    public long? FileSize { get; set; }
    public string? AudioFormat { get; set; }
    public int? Bitrate { get; set; }
    public string? LowQualityUrl { get; set; }
    public string? MediumQualityUrl { get; set; }
    public string? HighQualityUrl { get; set; }
    public string? LosslessQualityUrl { get; set; }
    public bool HasCopyright { get; set; }
}
