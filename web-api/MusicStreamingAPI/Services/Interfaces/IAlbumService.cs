using MusicStreamingAPI.DTOs.Albums;
using MusicStreamingAPI.DTOs.Common;

namespace MusicStreamingAPI.Services.Interfaces;

/// <summary>
/// Service interface for Album business logic
/// </summary>
public interface IAlbumService
{
    /// <summary>
    /// Get all albums with pagination and filtering
    /// </summary>
    Task<PagedResult<AlbumDto>> GetAlbumsAsync(AlbumQueryDto query);

    /// <summary>
    /// Get album by ID with optional songs included
    /// </summary>
    Task<AlbumDetailDto?> GetAlbumByIdAsync(long id, bool includeSongs = false);

    /// <summary>
    /// Create a new album
    /// </summary>
    Task<AlbumDetailDto> CreateAlbumAsync(AlbumCreateDto createDto);

    /// <summary>
    /// Update an existing album
    /// </summary>
    Task<AlbumDetailDto> UpdateAlbumAsync(long id, AlbumUpdateDto updateDto);

    /// <summary>
    /// Delete an album (soft delete)
    /// </summary>
    Task DeleteAlbumAsync(long id);

    /// <summary>
    /// Restore a soft-deleted album
    /// </summary>
    Task RestoreAlbumAsync(long id);

    /// <summary>
    /// Get all songs in an album
    /// </summary>
    Task<IReadOnlyList<AlbumDetailDto.SongInfo>> GetAlbumSongsAsync(long id);

    /// <summary>
    /// Recalculate album statistics (total tracks and duration)
    /// </summary>
    Task RecalculateAlbumStatsAsync(long id);
}
