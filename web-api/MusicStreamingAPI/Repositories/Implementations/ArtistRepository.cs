using Microsoft.EntityFrameworkCore;
using MusicStreamingAPI.Entities;
using MusicStreamingAPI.Repositories.Interfaces;

namespace MusicStreamingAPI.Repositories.Implementations;

/// <summary>
/// Repository implementation for Artist entity operations
/// </summary>
public class ArtistRepository : IArtistRepository
{
    private readonly MusicStreamingDbContext _context;
    private readonly ILogger<ArtistRepository> _logger;

    public ArtistRepository(MusicStreamingDbContext context, ILogger<ArtistRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<Artist>> GetAllAsync(
        int page, 
        int pageSize, 
        string? searchTerm, 
        string? country, 
        int? debutYear,
        bool? isActive,
        string sortBy,
        string sortOrder)
    {
        var query = _context.Artists
            .Where(a => a.DeletedAt == null)
            .AsNoTracking();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(a => a.Name.Contains(searchTerm));
        }

        if (!string.IsNullOrWhiteSpace(country))
        {
            query = query.Where(a => a.Country == country);
        }

        if (debutYear.HasValue)
        {
            query = query.Where(a => a.DebutYear == debutYear.Value);
        }

        if (isActive.HasValue)
        {
            query = query.Where(a => a.IsActive == isActive.Value);
        }

        // Apply sorting
        query = sortBy.ToLower() switch
        {
            "name" => sortOrder.ToLower() == "desc" 
                ? query.OrderByDescending(a => a.Name)
                : query.OrderBy(a => a.Name),
            "totalfollowers" => sortOrder.ToLower() == "desc"
                ? query.OrderByDescending(a => a.TotalFollowers)
                : query.OrderBy(a => a.TotalFollowers),
            "debutyear" => sortOrder.ToLower() == "desc"
                ? query.OrderByDescending(a => a.DebutYear)
                : query.OrderBy(a => a.DebutYear),
            "createdat" => sortOrder.ToLower() == "desc"
                ? query.OrderByDescending(a => a.CreatedAt)
                : query.OrderBy(a => a.CreatedAt),
            _ => query.OrderBy(a => a.Name)
        };

        // Apply pagination
        return await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetTotalCountAsync(
        string? searchTerm, 
        string? country, 
        int? debutYear,
        bool? isActive)
    {
        var query = _context.Artists
            .Where(a => a.DeletedAt == null);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(a => a.Name.Contains(searchTerm));
        }

        if (!string.IsNullOrWhiteSpace(country))
        {
            query = query.Where(a => a.Country == country);
        }

        if (debutYear.HasValue)
        {
            query = query.Where(a => a.DebutYear == debutYear.Value);
        }

        if (isActive.HasValue)
        {
            query = query.Where(a => a.IsActive == isActive.Value);
        }

        return await query.CountAsync();
    }

    public async Task<Artist?> GetByIdAsync(long id)
    {
        return await _context.Artists
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.ArtistId == id && a.DeletedAt == null);
    }

    public async Task<Artist> AddAsync(Artist artist)
    {
        artist.CreatedAt = DateTime.UtcNow;
        artist.UpdatedAt = DateTime.UtcNow;
        artist.IsActive = true;
        artist.TotalFollowers = 0;

        _context.Artists.Add(artist);
        await _context.SaveChangesAsync();
        
        _logger.LogInformation("Created new artist with ID: {ArtistId}, Name: {Name}", artist.ArtistId, artist.Name);
        
        return artist;
    }

    public async Task UpdateAsync(Artist artist)
    {
        artist.UpdatedAt = DateTime.UtcNow;
        
        _context.Artists.Update(artist);
        await _context.SaveChangesAsync();
        
        _logger.LogInformation("Updated artist with ID: {ArtistId}", artist.ArtistId);
    }

    public async Task DeleteAsync(long id)
    {
        var artist = await _context.Artists.FindAsync(id);
        if (artist != null)
        {
            artist.DeletedAt = DateTime.UtcNow;
            artist.UpdatedAt = DateTime.UtcNow;
            
            _context.Artists.Update(artist);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Soft deleted artist with ID: {ArtistId}", id);
        }
    }

    public async Task<bool> ExistsAsync(long id)
    {
        return await _context.Artists
            .AnyAsync(a => a.ArtistId == id && a.DeletedAt == null);
    }

    public async Task<bool> NameExistsAsync(string name, long? excludeId = null)
    {
        var query = _context.Artists
            .Where(a => a.DeletedAt == null && a.Name.ToLower() == name.ToLower());

        if (excludeId.HasValue)
        {
            query = query.Where(a => a.ArtistId != excludeId.Value);
        }

        return await query.AnyAsync();
    }

    public async Task<IEnumerable<Song>> GetArtistSongsAsync(long artistId, int page, int pageSize, string? sortBy)
    {
        var query = _context.Songs
            .Where(s => s.ArtistId == artistId && s.DeletedAt == null)
            .Include(s => s.Album)
            .AsNoTracking();

        // Apply sorting
        query = sortBy?.ToLower() switch
        {
            "playcount" => query.OrderByDescending(s => s.PlayCount),
            "releasedate" => query.OrderByDescending(s => s.ReleaseDate),
            "likecount" => query.OrderByDescending(s => s.LikeCount),
            "title" => query.OrderBy(s => s.Title),
            _ => query.OrderByDescending(s => s.CreatedAt)
        };

        return await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetArtistSongsCountAsync(long artistId)
    {
        return await _context.Songs
            .CountAsync(s => s.ArtistId == artistId && s.DeletedAt == null);
    }

    public async Task<IEnumerable<Album>> GetArtistAlbumsAsync(long artistId, int page, int pageSize)
    {
        return await _context.Albums
            .Where(a => a.ArtistId == artistId && a.DeletedAt == null)
            .OrderByDescending(a => a.ReleaseDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<int> GetArtistAlbumsCountAsync(long artistId)
    {
        return await _context.Albums
            .CountAsync(a => a.ArtistId == artistId && a.DeletedAt == null);
    }

    public async Task<long> GetArtistTotalPlaysAsync(long artistId)
    {
        var totalPlays = await _context.Songs
            .Where(s => s.ArtistId == artistId && s.DeletedAt == null)
            .SumAsync(s => (long?)s.PlayCount) ?? 0;

        return totalPlays;
    }

    public async Task<IEnumerable<User>> GetArtistFollowersAsync(long artistId, int page, int pageSize)
    {
        return await _context.UserFollowedArtists
            .Where(ufa => ufa.ArtistId == artistId)
            .Include(ufa => ufa.User)
            .OrderByDescending(ufa => ufa.FollowedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(ufa => ufa.User)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<int> GetArtistFollowersCountAsync(long artistId)
    {
        return await _context.UserFollowedArtists
            .CountAsync(ufa => ufa.ArtistId == artistId);
    }

    public async Task<IEnumerable<Artist>> GetTrendingArtistsAsync(int limit, int days = 7)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-days);

        // Get trending artists based on recent plays
        var trendingArtists = await _context.Songs
            .Where(s => s.DeletedAt == null && s.CreatedAt >= cutoffDate)
            .GroupBy(s => s.ArtistId)
            .Select(g => new
            {
                ArtistId = g.Key,
                RecentPlays = g.Sum(s => (long?)s.PlayCount) ?? 0
            })
            .OrderByDescending(x => x.RecentPlays)
            .Take(limit)
            .Join(_context.Artists.Where(a => a.DeletedAt == null),
                trend => trend.ArtistId,
                artist => artist.ArtistId,
                (trend, artist) => artist)
            .AsNoTracking()
            .ToListAsync();

        return trendingArtists;
    }

    public async Task<IEnumerable<Artist>> GetTopArtistsByFollowersAsync(int limit)
    {
        return await _context.Artists
            .Where(a => a.DeletedAt == null && a.IsActive == true)
            .OrderByDescending(a => a.TotalFollowers)
            .Take(limit)
            .AsNoTracking()
            .ToListAsync();
    }
}
