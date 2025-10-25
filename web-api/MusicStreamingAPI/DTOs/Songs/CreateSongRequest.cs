using System.ComponentModel.DataAnnotations;

namespace MusicStreamingAPI.DTOs.Songs;

public class CreateSongRequest
{
    [Required(ErrorMessage = "Song title is required")]
    [MaxLength(255, ErrorMessage = "Title cannot exceed 255 characters")]
    public string Title { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Duration is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Duration must be greater than 0")]
    public int Duration { get; set; } // in seconds
    
    public DateTime? ReleaseDate { get; set; }
    
    [Required(ErrorMessage = "Audio file URL is required")]
    [MaxLength(500, ErrorMessage = "Audio file URL cannot exceed 500 characters")]
    [Url(ErrorMessage = "Invalid URL format")]
    public string AudioFileUrl { get; set; } = string.Empty;
    
    [MaxLength(500, ErrorMessage = "Streaming URL cannot exceed 500 characters")]
    [Url(ErrorMessage = "Invalid URL format")]
    public string? StreamingUrl { get; set; }
    
    [MaxLength(500, ErrorMessage = "Cover image URL cannot exceed 500 characters")]
    [Url(ErrorMessage = "Invalid URL format")]
    public string? CoverImageUrl { get; set; }
    
    public string? Lyrics { get; set; }
    
    [MaxLength(100, ErrorMessage = "Genre cannot exceed 100 characters")]
    public string? Genre { get; set; }
    
    public long? FileSize { get; set; }
    
    [MaxLength(20, ErrorMessage = "Audio format cannot exceed 20 characters")]
    public string? AudioFormat { get; set; }
    
    public int? Bitrate { get; set; }
    
    // Quality URLs
    [MaxLength(500, ErrorMessage = "Low quality URL cannot exceed 500 characters")]
    [Url(ErrorMessage = "Invalid URL format")]
    public string? LowQualityUrl { get; set; }
    
    [MaxLength(500, ErrorMessage = "Medium quality URL cannot exceed 500 characters")]
    [Url(ErrorMessage = "Invalid URL format")]
    public string? MediumQualityUrl { get; set; }
    
    [MaxLength(500, ErrorMessage = "High quality URL cannot exceed 500 characters")]
    [Url(ErrorMessage = "Invalid URL format")]
    public string? HighQualityUrl { get; set; }
    
    [MaxLength(500, ErrorMessage = "Lossless quality URL cannot exceed 500 characters")]
    [Url(ErrorMessage = "Invalid URL format")]
    public string? LosslessQualityUrl { get; set; }
    
    [Required(ErrorMessage = "Artist ID is required")]
    [Range(1, long.MaxValue, ErrorMessage = "Invalid Artist ID")]
    public long ArtistId { get; set; }
    
    [Range(1, long.MaxValue, ErrorMessage = "Invalid Album ID")]
    public long? AlbumId { get; set; }
    
    public bool IsPublic { get; set; } = true;
    public bool HasCopyright { get; set; } = true;
}
