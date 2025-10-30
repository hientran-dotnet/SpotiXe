using MusicStreamingAPI.DTOs.Artists;
using MusicStreamingAPI.DTOs.Common;
using MusicStreamingAPI.DTOs.Songs;
using MusicStreamingAPI.DTOs.Albums;

namespace MusicStreamingAPI.Services.Interfaces;

/// <summary>
/// Service interface for Artist business logic
/// </summary>
public interface IArtistService
{
    // Basic CRUD operations
    Task<PagedResult<ArtistResponse>> GetAllArtistsAsync(ArtistQueryParameters queryParams);
    Task<ArtistDetailResponse?> GetArtistByIdAsync(long id);
    Task<ArtistResponse> CreateArtistAsync(CreateArtistRequest request);
    Task<ArtistResponse> UpdateArtistAsync(long id, UpdateArtistRequest request);
    Task<bool> DeleteArtistAsync(long id);
    
    // Artist content
    Task<PagedResult<SongResponse>> GetArtistSongsAsync(long artistId, int page, int pageSize, string? sortBy);
    Task<PagedResult<AlbumResponse>> GetArtistAlbumsAsync(long artistId, int page, int pageSize);
    
    // Statistics
    Task<ArtistStatisticsResponse?> GetArtistStatisticsAsync(long id);
    
    // Special queries
    Task<List<ArtistResponse>> GetTrendingArtistsAsync(int limit);
    Task<List<ArtistResponse>> GetTopArtistsAsync(int limit);
}
