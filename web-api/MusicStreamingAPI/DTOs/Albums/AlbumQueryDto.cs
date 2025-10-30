using System.ComponentModel.DataAnnotations;

namespace MusicStreamingAPI.DTOs.Albums;

/// <summary>
/// Query parameters for filtering and paginating albums
/// </summary>
public class AlbumQueryDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Page must be greater than 0")]
    public int Page { get; set; } = 1;

    [Range(1, 100, ErrorMessage = "Page size must be between 1 and 100")]
    public int PageSize { get; set; } = 20;

    public long? ArtistId { get; set; }

    public DateOnly? ReleasedFrom { get; set; }

    public DateOnly? ReleasedTo { get; set; }

    [MaxLength(255, ErrorMessage = "Keyword cannot exceed 255 characters")]
    public string? Keyword { get; set; }

    [RegularExpression("^(title|releaseDate|createdAt|updatedAt|totalTracks|totalDuration)$",
        ErrorMessage = "Invalid sort field. Allowed: title, releaseDate, createdAt, updatedAt, totalTracks, totalDuration")]
    public string SortBy { get; set; } = "createdAt";

    public bool Desc { get; set; } = true;

    public bool IncludeDeleted { get; set; } = false;
}
