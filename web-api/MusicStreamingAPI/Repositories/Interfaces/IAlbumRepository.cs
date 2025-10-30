using MusicStreamingAPI.Entities;

namespace MusicStreamingAPI.Repositories.Interfaces;

/// <summary>
/// Repository interface for Album entity operations
/// </summary>
public interface IAlbumRepository
{
    /// <summary>
    /// Get paginated and filtered list of albums
    /// </summary>
    Task<(IReadOnlyList<Album> Items, int TotalCount)> GetPagedAsync(
        int page = 1,
        int pageSize = 20,
        long? artistId = null,
        DateOnly? releasedFrom = null,
        DateOnly? releasedTo = null,
        string? keyword = null,
        string? sortBy = "createdAt",
        bool desc = true,
        bool includeDeleted = false);

    /// <summary>
    /// Get album by ID with optional related data
    /// </summary>
    Task<Album?> GetByIdAsync(long id, bool includeDeleted = false, bool includeArtist = true, bool includeSongs = false);

    /// <summary>
    /// Create a new album
    /// </summary>
    Task<Album> AddAsync(Album entity);

    /// <summary>
    /// Update an existing album
    /// </summary>
    Task UpdateAsync(Album entity);

    /// <summary>
    /// Soft delete an album (set DeletedAt timestamp)
    /// </summary>
    Task SoftDeleteAsync(long id);

    /// <summary>
    /// Restore a soft-deleted album (clear DeletedAt timestamp)
    /// </summary>
    Task RestoreAsync(long id);

    /// <summary>
    /// Check if album exists and is not deleted
    /// </summary>
    Task<bool> ExistsAsync(long id);

    /// <summary>
    /// Check if title exists for a specific artist (case-insensitive)
    /// </summary>
    Task<bool> TitleExistsForArtistAsync(string title, long artistId, long? excludeId = null);

    /// <summary>
    /// Recalculate album statistics (total tracks and duration) from songs
    /// </summary>
    Task RecalculateStatsAsync(long id);
}
