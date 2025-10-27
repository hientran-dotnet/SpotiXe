namespace MusicStreamingAPI.DTOs.Songs;

/// <summary>
/// Query parameters for filtering, sorting, and pagination
/// </summary>
public class SongQueryDto
{
    // Pagination
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;

    // Search
    public string? SearchTerm { get; set; }

    // Filters
    public string? Genre { get; set; }
    public long? ArtistId { get; set; }
    public long? AlbumId { get; set; }
    public bool? IsPublic { get; set; }
    public bool? IsActive { get; set; }
    public DateOnly? ReleaseDateFrom { get; set; }
    public DateOnly? ReleaseDateTo { get; set; }

    // Sorting
    public string SortBy { get; set; } = "CreatedAt"; // Title, ReleaseDate, PlayCount, LikeCount, CreatedAt
    public string SortOrder { get; set; } = "desc"; // asc, desc
}
