using AutoMapper;
using MusicStreamingAPI.DTOs.Artists;
using MusicStreamingAPI.DTOs.Common;
using MusicStreamingAPI.DTOs.Songs;
using MusicStreamingAPI.DTOs.Albums;
using MusicStreamingAPI.Entities;
using MusicStreamingAPI.Repositories.Interfaces;
using MusicStreamingAPI.Services.Interfaces;

namespace MusicStreamingAPI.Services.Implementations;

/// <summary>
/// Service implementation for Artist business logic
/// </summary>
public class ArtistService : IArtistService
{
    private readonly IArtistRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<ArtistService> _logger;

    public ArtistService(
        IArtistRepository repository,
        IMapper mapper,
        ILogger<ArtistService> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PagedResult<ArtistResponse>> GetAllArtistsAsync(ArtistQueryParameters queryParams)
    {
        try
        {
            // Validate and sanitize query parameters
            var page = queryParams.Page < 1 ? 1 : queryParams.Page;
            var pageSize = queryParams.PageSize < 1 ? 20 : (queryParams.PageSize > 100 ? 100 : queryParams.PageSize);

            var artists = await _repository.GetAllAsync(
                page,
                pageSize,
                queryParams.SearchTerm,
                queryParams.Country,
                queryParams.DebutYear,
                queryParams.IsActive,
                queryParams.SortBy,
                queryParams.SortOrder);

            var totalCount = await _repository.GetTotalCountAsync(
                queryParams.SearchTerm,
                queryParams.Country,
                queryParams.DebutYear,
                queryParams.IsActive);

            var artistDtos = _mapper.Map<List<ArtistResponse>>(artists);

            return new PagedResult<ArtistResponse>
            {
                Items = artistDtos,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting artists with query params: {@QueryParams}", queryParams);
            throw;
        }
    }

    public async Task<ArtistDetailResponse?> GetArtistByIdAsync(long id)
    {
        try
        {
            var artist = await _repository.GetByIdAsync(id);
            if (artist == null)
            {
                _logger.LogWarning("Artist with ID {ArtistId} not found", id);
                return null;
            }

            var artistDetail = _mapper.Map<ArtistDetailResponse>(artist);

            // Get statistics
            artistDetail.TotalSongs = await _repository.GetArtistSongsCountAsync(id);
            artistDetail.TotalAlbums = await _repository.GetArtistAlbumsCountAsync(id);

            // Get recent songs (last 5)
            var recentSongs = await _repository.GetArtistSongsAsync(id, 1, 5, "CreatedAt");
            artistDetail.RecentSongs = _mapper.Map<List<SongResponse>>(recentSongs);

            return artistDetail;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting artist detail for ID: {ArtistId}", id);
            throw;
        }
    }

    public async Task<ArtistResponse> CreateArtistAsync(CreateArtistRequest request)
    {
        try
        {
            // Validate business rules
            if (await _repository.NameExistsAsync(request.Name))
            {
                throw new ArgumentException($"Artist with name '{request.Name}' already exists");
            }

            // Validate debut year
            if (request.DebutYear.HasValue)
            {
                var currentYear = DateTime.UtcNow.Year;
                if (request.DebutYear.Value < 1900 || request.DebutYear.Value > currentYear + 1)
                {
                    throw new ArgumentException($"Debut year must be between 1900 and {currentYear + 1}");
                }
            }

            var artist = _mapper.Map<Artist>(request);
            var createdArtist = await _repository.AddAsync(artist);

            _logger.LogInformation("Created new artist: {ArtistName} (ID: {ArtistId})", createdArtist.Name, createdArtist.ArtistId);

            return _mapper.Map<ArtistResponse>(createdArtist);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating artist: {@Request}", request);
            throw;
        }
    }

    public async Task<ArtistResponse> UpdateArtistAsync(long id, UpdateArtistRequest request)
    {
        try
        {
            var existingArtist = await _repository.GetByIdAsync(id);
            if (existingArtist == null)
            {
                throw new KeyNotFoundException($"Artist with ID {id} not found");
            }

            // Check if name is being changed and if new name already exists
            if (request.Name != existingArtist.Name && await _repository.NameExistsAsync(request.Name, id))
            {
                throw new ArgumentException($"Artist with name '{request.Name}' already exists");
            }

            // Validate debut year
            if (request.DebutYear.HasValue)
            {
                var currentYear = DateTime.UtcNow.Year;
                if (request.DebutYear.Value < 1900 || request.DebutYear.Value > currentYear + 1)
                {
                    throw new ArgumentException($"Debut year must be between 1900 and {currentYear + 1}");
                }
            }

            // Update properties
            existingArtist.Name = request.Name;
            existingArtist.Bio = request.Bio;
            existingArtist.ProfileImageUrl = request.ProfileImageUrl;
            existingArtist.Country = request.Country;
            existingArtist.DebutYear = request.DebutYear;
            existingArtist.IsActive = request.IsActive;

            await _repository.UpdateAsync(existingArtist);

            _logger.LogInformation("Updated artist: {ArtistName} (ID: {ArtistId})", existingArtist.Name, id);

            return _mapper.Map<ArtistResponse>(existingArtist);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating artist ID {ArtistId}: {@Request}", id, request);
            throw;
        }
    }

    public async Task<bool> DeleteArtistAsync(long id)
    {
        try
        {
            if (!await _repository.ExistsAsync(id))
            {
                _logger.LogWarning("Attempted to delete non-existent artist with ID: {ArtistId}", id);
                return false;
            }

            await _repository.DeleteAsync(id);
            
            _logger.LogInformation("Soft deleted artist with ID: {ArtistId}", id);
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting artist with ID: {ArtistId}", id);
            throw;
        }
    }

    public async Task<PagedResult<SongResponse>> GetArtistSongsAsync(long artistId, int page, int pageSize, string? sortBy)
    {
        try
        {
            if (!await _repository.ExistsAsync(artistId))
            {
                throw new KeyNotFoundException($"Artist with ID {artistId} not found");
            }

            var validatedPage = page < 1 ? 1 : page;
            var validatedPageSize = pageSize < 1 ? 20 : (pageSize > 100 ? 100 : pageSize);

            var songs = await _repository.GetArtistSongsAsync(artistId, validatedPage, validatedPageSize, sortBy);
            var totalCount = await _repository.GetArtistSongsCountAsync(artistId);

            var songDtos = _mapper.Map<List<SongResponse>>(songs);

            return new PagedResult<SongResponse>
            {
                Items = songDtos,
                Page = validatedPage,
                PageSize = validatedPageSize,
                TotalCount = totalCount
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting songs for artist ID: {ArtistId}", artistId);
            throw;
        }
    }

    public async Task<PagedResult<AlbumResponse>> GetArtistAlbumsAsync(long artistId, int page, int pageSize)
    {
        try
        {
            if (!await _repository.ExistsAsync(artistId))
            {
                throw new KeyNotFoundException($"Artist with ID {artistId} not found");
            }

            var validatedPage = page < 1 ? 1 : page;
            var validatedPageSize = pageSize < 1 ? 20 : (pageSize > 100 ? 100 : pageSize);

            var albums = await _repository.GetArtistAlbumsAsync(artistId, validatedPage, validatedPageSize);
            var totalCount = await _repository.GetArtistAlbumsCountAsync(artistId);

            var albumDtos = _mapper.Map<List<AlbumResponse>>(albums);

            return new PagedResult<AlbumResponse>
            {
                Items = albumDtos,
                Page = validatedPage,
                PageSize = validatedPageSize,
                TotalCount = totalCount
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting albums for artist ID: {ArtistId}", artistId);
            throw;
        }
    }

    public async Task<ArtistStatisticsResponse?> GetArtistStatisticsAsync(long id)
    {
        try
        {
            var artist = await _repository.GetByIdAsync(id);
            if (artist == null)
            {
                _logger.LogWarning("Artist with ID {ArtistId} not found", id);
                return null;
            }

            var statistics = new ArtistStatisticsResponse
            {
                ArtistId = artist.ArtistId,
                Name = artist.Name,
                TotalSongs = await _repository.GetArtistSongsCountAsync(id),
                TotalAlbums = await _repository.GetArtistAlbumsCountAsync(id),
                TotalFollowers = artist.TotalFollowers ?? 0,
                TotalPlayCount = await _repository.GetArtistTotalPlaysAsync(id),
                TotalLikeCount = 0 // Can be calculated from songs if needed
            };

            return statistics;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting statistics for artist ID: {ArtistId}", id);
            throw;
        }
    }

    public async Task<List<ArtistResponse>> GetTrendingArtistsAsync(int limit)
    {
        try
        {
            var validatedLimit = limit < 1 ? 10 : (limit > 100 ? 100 : limit);
            
            var trendingArtists = await _repository.GetTrendingArtistsAsync(validatedLimit);
            
            return _mapper.Map<List<ArtistResponse>>(trendingArtists);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting trending artists");
            throw;
        }
    }

    public async Task<List<ArtistResponse>> GetTopArtistsAsync(int limit)
    {
        try
        {
            var validatedLimit = limit < 1 ? 50 : (limit > 100 ? 100 : limit);
            
            var topArtists = await _repository.GetTopArtistsByFollowersAsync(validatedLimit);
            
            return _mapper.Map<List<ArtistResponse>>(topArtists);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting top artists");
            throw;
        }
    }
}
