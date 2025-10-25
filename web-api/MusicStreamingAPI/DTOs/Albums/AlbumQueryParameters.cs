namespace MusicStreamingAPI.DTOs.Albums;

public class AlbumQueryParameters
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SearchTerm { get; set; }
    public long? ArtistId { get; set; }
    public int? ReleaseYear { get; set; }
    public bool? IsActive { get; set; } = true;
    public string SortBy { get; set; } = "CreatedAt"; // Title, ReleaseDate, CreatedAt
    public string SortOrder { get; set; } = "desc"; // asc, desc
}
