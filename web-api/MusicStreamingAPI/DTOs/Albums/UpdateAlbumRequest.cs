using System.ComponentModel.DataAnnotations;

namespace MusicStreamingAPI.DTOs.Albums;

public class UpdateAlbumRequest
{
    [Required(ErrorMessage = "Album title is required")]
    [MaxLength(255, ErrorMessage = "Title cannot exceed 255 characters")]
    public string Title { get; set; } = string.Empty;
    
    public DateTime? ReleaseDate { get; set; }
    
    [MaxLength(500, ErrorMessage = "Cover image URL cannot exceed 500 characters")]
    [Url(ErrorMessage = "Invalid URL format")]
    public string? CoverImageUrl { get; set; }
    
    public string? Description { get; set; }
    
    public bool IsActive { get; set; } = true;
}
