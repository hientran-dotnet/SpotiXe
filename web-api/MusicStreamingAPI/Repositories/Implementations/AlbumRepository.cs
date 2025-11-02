using Microsoft.EntityFrameworkCore;
using MusicStreamingAPI.Entities;
using MusicStreamingAPI.Repositories.Interfaces;

namespace MusicStreamingAPI.Repositories.Implementations;

/// <summary>
/// Repository implementation for Album entity
/// </summary>
public class AlbumRepository : IAlbumRepository
{
    private readonly MusicStreamingDbContext _context;
    private readonly ILogger<AlbumRepository> _logger;

    public AlbumRepository(MusicStreamingDbContext context, ILogger<AlbumRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<(IReadOnlyList<Album> Items, int TotalCount)> GetPagedAsync(
        int page = 1,
        int pageSize = 20,
        long? artistId = null,
        DateOnly? releasedFrom = null,
        DateOnly? releasedTo = null,
        string? keyword = null,
        string? sortBy = "createdAt",
        bool desc = true,
        bool includeDeleted = false)
    {
        try
        {
            var query = _context.Albums
                .Include(a => a.Artist)
                .AsQueryable();

            // Base filter: exclude soft-deleted unless requested
            if (!includeDeleted)
            {
                query = query.Where(a => a.DeletedAt == null);
            }

            // Apply filters
            if (artistId.HasValue)
            {
                query = query.Where(a => a.ArtistId == artistId.Value);
            }

            if (releasedFrom.HasValue)
            {
                query = query.Where(a => a.ReleaseDate >= releasedFrom.Value);
            }

            if (releasedTo.HasValue)
            {
                query = query.Where(a => a.ReleaseDate <= releasedTo.Value);
            }

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var keywordLower = keyword.ToLower();
                query = query.Where(a => a.Title.ToLower().Contains(keywordLower));
            }

            // Get total count before pagination
            var totalCount = await query.CountAsync();

            // Apply sorting
            query = (sortBy ?? "createdAt").ToLower() switch
            {
                "title" => desc ? query.OrderByDescending(a => a.Title) : query.OrderBy(a => a.Title),
                "releasedate" => desc ? query.OrderByDescending(a => a.ReleaseDate) : query.OrderBy(a => a.ReleaseDate),
                "createdat" => desc ? query.OrderByDescending(a => a.CreatedAt) : query.OrderBy(a => a.CreatedAt),
                "updatedat" => desc ? query.OrderByDescending(a => a.UpdatedAt) : query.OrderBy(a => a.UpdatedAt),
                "totaltracks" => desc ? query.OrderByDescending(a => a.TotalTracks) : query.OrderBy(a => a.TotalTracks),
                "totalduration" => desc ? query.OrderByDescending(a => a.TotalDuration) : query.OrderBy(a => a.TotalDuration),
                _ => desc ? query.OrderByDescending(a => a.CreatedAt) : query.OrderBy(a => a.CreatedAt)
            };

            // Apply pagination
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync();

            _logger.LogInformation("Retrieved {Count} albums (page {Page}/{PageSize})", items.Count, page, pageSize);

            return (items, totalCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting paged albums");
            throw;
        }
    }

    public async Task<Album?> GetByIdAsync(long id, bool includeDeleted = false, bool includeArtist = true, bool includeSongs = false)
    {
        try
        {
            var query = _context.Albums.Where(a => a.AlbumId == id);

            if (!includeDeleted)
            {
                query = query.Where(a => a.DeletedAt == null);
            }

            if (includeArtist)
            {
                query = query.Include(a => a.Artist);
            }

            if (includeSongs)
            {
                query = query.Include(a => a.Songs.Where(s => s.DeletedAt == null));
            }

            return await query.FirstOrDefaultAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting album by ID: {AlbumId}", id);
            throw;
        }
    }

    public async Task<Album> AddAsync(Album entity)
    {
        try
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            entity.TotalTracks ??= 0;
            entity.TotalDuration ??= 0;
            entity.IsActive ??= true;

            await _context.Albums.AddAsync(entity);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created new album with ID: {AlbumId}", entity.AlbumId);

            return entity;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating album: {@Album}", entity);
            throw;
        }
    }

    public async Task UpdateAsync(Album entity)
    {
        try
        {
            entity.UpdatedAt = DateTime.UtcNow;

            _context.Albums.Update(entity);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated album with ID: {AlbumId}", entity.AlbumId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating album: {@Album}", entity);
            throw;
        }
    }

    public async Task SoftDeleteAsync(long id)
    {
        try
        {
            var album = await _context.Albums.FindAsync(id);
            if (album == null || album.DeletedAt != null)
            {
                throw new KeyNotFoundException($"Album with ID {id} not found or already deleted");
            }

            album.DeletedAt = DateTime.UtcNow;
            album.IsActive = false;
            album.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Soft deleted album with ID: {AlbumId}", id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while soft deleting album with ID: {AlbumId}", id);
            throw;
        }
    }

    public async Task RestoreAsync(long id)
    {
        try
        {
            var album = await _context.Albums.FindAsync(id);
            if (album == null)
            {
                throw new KeyNotFoundException($"Album with ID {id} not found");
            }

            if (album.DeletedAt == null)
            {
                throw new InvalidOperationException($"Album with ID {id} is not deleted");
            }

            album.DeletedAt = null;
            album.IsActive = true;
            album.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Restored album with ID: {AlbumId}", id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while restoring album with ID: {AlbumId}", id);
            throw;
        }
    }

    public async Task<bool> ExistsAsync(long id)
    {
        try
        {
            return await _context.Albums.AnyAsync(a => a.AlbumId == id && a.DeletedAt == null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while checking if album exists with ID: {AlbumId}", id);
            throw;
        }
    }

    public async Task<bool> TitleExistsForArtistAsync(string title, long artistId, long? excludeId = null)
    {
        try
        {
            var query = _context.Albums
                .Where(a => a.ArtistId == artistId
                    && a.Title.ToLower() == title.ToLower()
                    && a.DeletedAt == null);

            if (excludeId.HasValue)
            {
                query = query.Where(a => a.AlbumId != excludeId.Value);
            }

            return await query.AnyAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while checking if title exists for artist");
            throw;
        }
    }

    public async Task RecalculateStatsAsync(long id)
    {
        try
        {
            var album = await _context.Albums.FindAsync(id);
            if (album == null || album.DeletedAt != null)
            {
                throw new KeyNotFoundException($"Album with ID {id} not found");
            }

            var songs = await _context.Songs
                .Where(s => s.AlbumId == id && s.DeletedAt == null)
                .ToListAsync();

            album.TotalTracks = songs.Count;
            album.TotalDuration = songs.Sum(s => s.Duration);
            album.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Recalculated stats for album ID: {AlbumId} - Tracks: {TotalTracks}, Duration: {TotalDuration}",
                id, album.TotalTracks, album.TotalDuration);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while recalculating stats for album ID: {AlbumId}", id);
            throw;
        }
    }
}
