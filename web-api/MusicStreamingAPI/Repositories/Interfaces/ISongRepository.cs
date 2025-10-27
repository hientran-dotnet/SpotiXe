using MusicStreamingAPI.DTOs.Songs;
using MusicStreamingAPI.Entities;

namespace MusicStreamingAPI.Repositories.Interfaces;

/// <summary>
/// Repository interface for Song entity operations
/// </summary>
public interface ISongRepository
{
    /// <summary>
    /// Get all songs with optional filtering, sorting, and pagination
    /// </summary>
    Task<(IEnumerable<Song> Songs, int TotalCount)> GetAllAsync(SongQueryDto query);

    /// <summary>
    /// Get song by ID with optional related data
    /// </summary>
    Task<Song?> GetByIdAsync(long id, bool includeRelatedData = true);

    /// <summary>
    /// Create a new song
    /// </summary>
    Task<Song> CreateAsync(Song song);

    /// <summary>
    /// Update an existing song
    /// </summary>
    Task<Song> UpdateAsync(Song song);

    /// <summary>
    /// Soft delete a song (set DeletedAt timestamp)
    /// </summary>
    Task<bool> DeleteAsync(long id);

    /// <summary>
    /// Get all songs by artist ID
    /// </summary>
    Task<IEnumerable<Song>> GetByArtistIdAsync(long artistId);

    /// <summary>
    /// Get all songs by album ID
    /// </summary>
    Task<IEnumerable<Song>> GetByAlbumIdAsync(long albumId);

    /// <summary>
    /// Search songs by term (title, artist name, album name, genre)
    /// </summary>
    Task<IEnumerable<Song>> SearchAsync(string searchTerm);

    /// <summary>
    /// Increment play count atomically
    /// </summary>
    Task<bool> IncrementPlayCountAsync(long songId);

    /// <summary>
    /// Increment like count atomically
    /// </summary>
    Task<bool> IncrementLikeCountAsync(long songId);

    /// <summary>
    /// Decrement like count atomically (for unlike)
    /// </summary>
    Task<bool> DecrementLikeCountAsync(long songId);

    /// <summary>
    /// Check if song exists
    /// </summary>
    Task<bool> ExistsAsync(long id);
}
