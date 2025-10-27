using MusicStreamingAPI.DTOs.Common;
using MusicStreamingAPI.DTOs.Songs;

namespace MusicStreamingAPI.Services.Interfaces;

/// <summary>
/// Service interface for Song business logic
/// </summary>
public interface ISongService
{
    /// <summary>
    /// Get all songs with pagination and filtering
    /// </summary>
    Task<PagedResult<SongListDto>> GetAllSongsAsync(SongQueryDto query);

    /// <summary>
    /// Get song by ID with full details
    /// </summary>
    Task<SongResponseDto?> GetSongByIdAsync(long id);

    /// <summary>
    /// Create a new song
    /// </summary>
    Task<SongResponseDto> CreateSongAsync(SongCreateDto createDto);

    /// <summary>
    /// Update an existing song
    /// </summary>
    Task<SongResponseDto?> UpdateSongAsync(long id, SongUpdateDto updateDto);

    /// <summary>
    /// Delete a song (soft delete)
    /// </summary>
    Task<bool> DeleteSongAsync(long id);

    /// <summary>
    /// Get songs by artist
    /// </summary>
    Task<IEnumerable<SongListDto>> GetSongsByArtistAsync(long artistId);

    /// <summary>
    /// Get songs by album
    /// </summary>
    Task<IEnumerable<SongListDto>> GetSongsByAlbumAsync(long albumId);

    /// <summary>
    /// Search songs
    /// </summary>
    Task<IEnumerable<SongListDto>> SearchSongsAsync(string searchTerm);

    /// <summary>
    /// Play a song (increment play count)
    /// </summary>
    Task<bool> PlaySongAsync(long songId);

    /// <summary>
    /// Like a song (increment like count)
    /// </summary>
    Task<bool> LikeSongAsync(long songId);

    /// <summary>
    /// Unlike a song (decrement like count)
    /// </summary>
    Task<bool> UnlikeSongAsync(long songId);
}
