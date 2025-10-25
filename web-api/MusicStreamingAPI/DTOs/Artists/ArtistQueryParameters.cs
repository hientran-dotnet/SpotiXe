namespace MusicStreamingAPI.DTOs.Artists;

public class ArtistQueryParameters
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SearchTerm { get; set; } // Search by Name
    public string? Country { get; set; }
    public int? DebutYear { get; set; }
    public bool? IsActive { get; set; } = true;
    public string SortBy { get; set; } = "Name"; // Name, TotalFollowers, CreatedAt
    public string SortOrder { get; set; } = "asc"; // asc, desc
}
