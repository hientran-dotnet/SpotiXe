using System.ComponentModel.DataAnnotations;

namespace MusicStreamingAPI.DTOs.Albums;

/// <summary>
/// DTO for creating a new album
/// Example:
/// {
///   "title": "Hybrid Theory",
///   "releaseDate": "2000-10-24",
///   "coverImageUrl": "https://cdn.example.com/covers/hybrid-theory.jpg",
///   "description": "Debut studio album by Linkin Park",
///   "artistId": 123,
///   "isActive": true
/// }
/// </summary>
public class AlbumCreateDto
{
    [Required(ErrorMessage = "Album title is required")]
    [StringLength(255, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 255 characters")]
    public string Title { get; set; } = string.Empty;

    public DateOnly? ReleaseDate { get; set; }

    [MaxLength(500, ErrorMessage = "Cover image URL cannot exceed 500 characters")]
    [Url(ErrorMessage = "Invalid cover image URL format")]
    public string? CoverImageUrl { get; set; }

    public string? Description { get; set; }

    [Required(ErrorMessage = "Artist ID is required")]
    [Range(1, long.MaxValue, ErrorMessage = "Artist ID must be greater than 0")]
    public long ArtistId { get; set; }

    public bool IsActive { get; set; } = true;
}
