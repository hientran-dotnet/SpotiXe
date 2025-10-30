using MusicStreamingAPI.Entities;

namespace MusicStreamingAPI.Repositories.Interfaces;

/// <summary>
/// Repository interface for Artist entity operations
/// </summary>
public interface IArtistRepository
{
    // Basic CRUD operations
    Task<IEnumerable<Artist>> GetAllAsync(
        int page, 
        int pageSize, 
        string? searchTerm, 
        string? country, 
        int? debutYear,
        bool? isActive,
        string sortBy,
        string sortOrder);
    
    Task<int> GetTotalCountAsync(
        string? searchTerm, 
        string? country, 
        int? debutYear,
        bool? isActive);
    
    Task<Artist?> GetByIdAsync(long id);
    Task<Artist> AddAsync(Artist artist);
    Task UpdateAsync(Artist artist);
    Task DeleteAsync(long id); // Soft delete
    Task<bool> ExistsAsync(long id);
    Task<bool> NameExistsAsync(string name, long? excludeId = null);
    
    // Artist songs and albums
    Task<IEnumerable<Song>> GetArtistSongsAsync(long artistId, int page, int pageSize, string? sortBy);
    Task<int> GetArtistSongsCountAsync(long artistId);
    
    Task<IEnumerable<Album>> GetArtistAlbumsAsync(long artistId, int page, int pageSize);
    Task<int> GetArtistAlbumsCountAsync(long artistId);
    
    // Statistics
    Task<long> GetArtistTotalPlaysAsync(long artistId);
    
    // Followers
    Task<IEnumerable<User>> GetArtistFollowersAsync(long artistId, int page, int pageSize);
    Task<int> GetArtistFollowersCountAsync(long artistId);
    
    // Special queries
    Task<IEnumerable<Artist>> GetTrendingArtistsAsync(int limit, int days = 7);
    Task<IEnumerable<Artist>> GetTopArtistsByFollowersAsync(int limit);
}
