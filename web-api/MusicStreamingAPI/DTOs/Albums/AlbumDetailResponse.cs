using MusicStreamingAPI.DTOs.Songs;

namespace MusicStreamingAPI.DTOs.Albums;

public class AlbumDetailResponse : AlbumResponse
{
    public List<SongResponse> Songs { get; set; } = new();
}
