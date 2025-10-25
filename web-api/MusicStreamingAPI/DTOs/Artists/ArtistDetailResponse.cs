using MusicStreamingAPI.DTOs.Songs;

namespace MusicStreamingAPI.DTOs.Artists;

public class ArtistDetailResponse : ArtistResponse
{
    public int TotalSongs { get; set; }
    public int TotalAlbums { get; set; }
    public List<SongResponse> RecentSongs { get; set; } = new();
}
