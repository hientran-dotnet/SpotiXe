using System.ComponentModel.DataAnnotations;

namespace MusicStreamingAPI.DTOs.Albums;

/// <summary>
/// DTO for updating an existing album
/// Example:
/// {
///   "title": "Hybrid Theory (Remastered)",
///   "coverImageUrl": "https://cdn.example.com/covers/hybrid-theory-remaster.jpg"
/// }
/// </summary>
public class AlbumUpdateDto
{
    [StringLength(255, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 255 characters")]
    public string? Title { get; set; }

    public DateOnly? ReleaseDate { get; set; }

    [MaxLength(500, ErrorMessage = "Cover image URL cannot exceed 500 characters")]
    [Url(ErrorMessage = "Invalid cover image URL format")]
    public string? CoverImageUrl { get; set; }

    public string? Description { get; set; }

    [Range(1, long.MaxValue, ErrorMessage = "Artist ID must be greater than 0")]
    public long? ArtistId { get; set; }

    public bool? IsActive { get; set; }
}
