namespace MusicStreamingAPI.DTOs.Songs;

public class SongQueryParameters
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SearchTerm { get; set; }
    public string? Genre { get; set; }
    public long? ArtistId { get; set; }
    public long? AlbumId { get; set; }
    public bool? IsPublic { get; set; } = true;
    public bool? IsActive { get; set; } = true;
    public string SortBy { get; set; } = "CreatedAt"; // Title, PlayCount, LikeCount, CreatedAt
    public string SortOrder { get; set; } = "desc"; // asc, desc
}
