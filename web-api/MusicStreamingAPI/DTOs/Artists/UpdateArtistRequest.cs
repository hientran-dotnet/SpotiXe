using System.ComponentModel.DataAnnotations;

namespace MusicStreamingAPI.DTOs.Artists;

public class UpdateArtistRequest
{
    [Required(ErrorMessage = "Artist name is required")]
    [MaxLength(255, ErrorMessage = "Name cannot exceed 255 characters")]
    public string Name { get; set; } = string.Empty;
    
    public string? Bio { get; set; }
    
    [MaxLength(500, ErrorMessage = "Profile image URL cannot exceed 500 characters")]
    [Url(ErrorMessage = "Invalid URL format")]
    public string? ProfileImageUrl { get; set; }
    
    [MaxLength(100, ErrorMessage = "Country cannot exceed 100 characters")]
    public string? Country { get; set; }
    
    [Range(1900, 2100, ErrorMessage = "Debut year must be between 1900 and 2100")]
    public int? DebutYear { get; set; }
    
    public bool IsActive { get; set; } = true;
}
