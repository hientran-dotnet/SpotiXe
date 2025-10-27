using Microsoft.EntityFrameworkCore;
using MusicStreamingAPI.DTOs.Songs;
using MusicStreamingAPI.Entities;
using MusicStreamingAPI.Repositories.Interfaces;

namespace MusicStreamingAPI.Repositories.Implementations;

/// <summary>
/// Repository implementation for Song entity
/// </summary>
public class SongRepository : ISongRepository
{
    private readonly MusicStreamingDbContext _context;
    private readonly ILogger<SongRepository> _logger;

    public SongRepository(MusicStreamingDbContext context, ILogger<SongRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<(IEnumerable<Song> Songs, int TotalCount)> GetAllAsync(SongQueryDto query)
    {
        try
        {
            var queryable = _context.Songs
                .Include(s => s.Artist)
                .Include(s => s.Album)
                .Where(s => s.DeletedAt == null); // Always exclude soft-deleted records

            // Apply filters
            if (!string.IsNullOrWhiteSpace(query.SearchTerm))
            {
                var searchLower = query.SearchTerm.ToLower();
                queryable = queryable.Where(s =>
                    s.Title.ToLower().Contains(searchLower) ||
                    s.Artist.Name.ToLower().Contains(searchLower) ||
                    (s.Album != null && s.Album.Title.ToLower().Contains(searchLower)) ||
                    (s.Genre != null && s.Genre.ToLower().Contains(searchLower))
                );
            }

            if (!string.IsNullOrWhiteSpace(query.Genre))
            {
                queryable = queryable.Where(s => s.Genre == query.Genre);
            }

            if (query.ArtistId.HasValue)
            {
                queryable = queryable.Where(s => s.ArtistId == query.ArtistId.Value);
            }

            if (query.AlbumId.HasValue)
            {
                queryable = queryable.Where(s => s.AlbumId == query.AlbumId.Value);
            }

            if (query.IsPublic.HasValue)
            {
                queryable = queryable.Where(s => s.IsPublic == query.IsPublic.Value);
            }

            if (query.IsActive.HasValue)
            {
                queryable = queryable.Where(s => s.IsActive == query.IsActive.Value);
            }

            if (query.ReleaseDateFrom.HasValue)
            {
                queryable = queryable.Where(s => s.ReleaseDate >= query.ReleaseDateFrom.Value);
            }

            if (query.ReleaseDateTo.HasValue)
            {
                queryable = queryable.Where(s => s.ReleaseDate <= query.ReleaseDateTo.Value);
            }

            // Get total count before pagination
            var totalCount = await queryable.CountAsync();

            // Apply sorting
            queryable = query.SortBy.ToLower() switch
            {
                "title" => query.SortOrder.ToLower() == "asc"
                    ? queryable.OrderBy(s => s.Title)
                    : queryable.OrderByDescending(s => s.Title),

                "releasedate" => query.SortOrder.ToLower() == "asc"
                    ? queryable.OrderBy(s => s.ReleaseDate)
                    : queryable.OrderByDescending(s => s.ReleaseDate),

                "playcount" => query.SortOrder.ToLower() == "asc"
                    ? queryable.OrderBy(s => s.PlayCount)
                    : queryable.OrderByDescending(s => s.PlayCount),

                "likecount" => query.SortOrder.ToLower() == "asc"
                    ? queryable.OrderBy(s => s.LikeCount)
                    : queryable.OrderByDescending(s => s.LikeCount),

                "createdat" => query.SortOrder.ToLower() == "asc"
                    ? queryable.OrderBy(s => s.CreatedAt)
                    : queryable.OrderByDescending(s => s.CreatedAt),

                _ => queryable.OrderByDescending(s => s.CreatedAt)
            };

            // Apply pagination
            var songs = await queryable
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .AsNoTracking()
                .ToListAsync();

            return (songs, totalCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting songs with query {@Query}", query);
            throw;
        }
    }

    public async Task<Song?> GetByIdAsync(long id, bool includeRelatedData = true)
    {
        try
        {
            var query = _context.Songs.Where(s => s.SongId == id && s.DeletedAt == null);

            if (includeRelatedData)
            {
                query = query
                    .Include(s => s.Artist)
                    .Include(s => s.Album);
            }

            return await query.FirstOrDefaultAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting song by ID: {SongId}", id);
            throw;
        }
    }

    public async Task<Song> CreateAsync(Song song)
    {
        try
        {
            song.CreatedAt = DateTime.UtcNow;
            song.UpdatedAt = DateTime.UtcNow;
            song.PlayCount = 0;
            song.LikeCount = 0;

            await _context.Songs.AddAsync(song);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created new song with ID: {SongId}", song.SongId);

            return song;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating song: {@Song}", song);
            throw;
        }
    }

    public async Task<Song> UpdateAsync(Song song)
    {
        try
        {
            song.UpdatedAt = DateTime.UtcNow;

            _context.Songs.Update(song);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated song with ID: {SongId}", song.SongId);

            return song;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating song: {@Song}", song);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(long id)
    {
        try
        {
            var song = await _context.Songs.FindAsync(id);
            if (song == null || song.DeletedAt != null)
            {
                return false;
            }

            // Soft delete
            song.DeletedAt = DateTime.UtcNow;
            song.IsActive = false;
            song.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Soft deleted song with ID: {SongId}", id);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting song with ID: {SongId}", id);
            throw;
        }
    }

    public async Task<IEnumerable<Song>> GetByArtistIdAsync(long artistId)
    {
        try
        {
            return await _context.Songs
                .Include(s => s.Artist)
                .Include(s => s.Album)
                .Where(s => s.ArtistId == artistId && s.DeletedAt == null)
                .OrderByDescending(s => s.CreatedAt)
                .AsNoTracking()
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting songs by artist ID: {ArtistId}", artistId);
            throw;
        }
    }

    public async Task<IEnumerable<Song>> GetByAlbumIdAsync(long albumId)
    {
        try
        {
            return await _context.Songs
                .Include(s => s.Artist)
                .Include(s => s.Album)
                .Where(s => s.AlbumId == albumId && s.DeletedAt == null)
                .OrderBy(s => s.Title)
                .AsNoTracking()
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting songs by album ID: {AlbumId}", albumId);
            throw;
        }
    }

    public async Task<IEnumerable<Song>> SearchAsync(string searchTerm)
    {
        try
        {
            var searchLower = searchTerm.ToLower();

            return await _context.Songs
                .Include(s => s.Artist)
                .Include(s => s.Album)
                .Where(s => s.DeletedAt == null &&
                    (s.Title.ToLower().Contains(searchLower) ||
                     s.Artist.Name.ToLower().Contains(searchLower) ||
                     (s.Album != null && s.Album.Title.ToLower().Contains(searchLower)) ||
                     (s.Genre != null && s.Genre.ToLower().Contains(searchLower))))
                .OrderByDescending(s => s.PlayCount)
                .Take(50) // Limit search results
                .AsNoTracking()
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while searching songs with term: {SearchTerm}", searchTerm);
            throw;
        }
    }

    public async Task<bool> IncrementPlayCountAsync(long songId)
    {
        try
        {
            var song = await _context.Songs.FindAsync(songId);
            if (song == null || song.DeletedAt != null)
            {
                return false;
            }

            song.PlayCount = (song.PlayCount ?? 0) + 1;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Incremented play count for song ID: {SongId}", songId);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while incrementing play count for song ID: {SongId}", songId);
            throw;
        }
    }

    public async Task<bool> IncrementLikeCountAsync(long songId)
    {
        try
        {
            var song = await _context.Songs.FindAsync(songId);
            if (song == null || song.DeletedAt != null)
            {
                return false;
            }

            song.LikeCount = (song.LikeCount ?? 0) + 1;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Incremented like count for song ID: {SongId}", songId);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while incrementing like count for song ID: {SongId}", songId);
            throw;
        }
    }

    public async Task<bool> DecrementLikeCountAsync(long songId)
    {
        try
        {
            var song = await _context.Songs.FindAsync(songId);
            if (song == null || song.DeletedAt != null)
            {
                return false;
            }

            song.LikeCount = Math.Max((song.LikeCount ?? 0) - 1, 0); // Prevent negative counts
            await _context.SaveChangesAsync();

            _logger.LogInformation("Decremented like count for song ID: {SongId}", songId);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while decrementing like count for song ID: {SongId}", songId);
            throw;
        }
    }

    public async Task<bool> ExistsAsync(long id)
    {
        try
        {
            return await _context.Songs.AnyAsync(s => s.SongId == id && s.DeletedAt == null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while checking if song exists with ID: {SongId}", id);
            throw;
        }
    }
}
