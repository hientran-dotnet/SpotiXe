using AutoMapper;
using MusicStreamingAPI.DTOs.Albums;
using MusicStreamingAPI.DTOs.Common;
using MusicStreamingAPI.Entities;
using MusicStreamingAPI.Repositories.Interfaces;
using MusicStreamingAPI.Services.Interfaces;

namespace MusicStreamingAPI.Services.Implementations;

/// <summary>
/// Service implementation for Album business logic
/// </summary>
public class AlbumService : IAlbumService
{
    private readonly IAlbumRepository _albumRepository;
    private readonly IArtistRepository _artistRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<AlbumService> _logger;

    public AlbumService(
        IAlbumRepository albumRepository,
        IArtistRepository artistRepository,
        IMapper mapper,
        ILogger<AlbumService> logger)
    {
        _albumRepository = albumRepository;
        _artistRepository = artistRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PagedResult<AlbumDto>> GetAlbumsAsync(AlbumQueryDto query)
    {
        try
        {
            var (items, totalCount) = await _albumRepository.GetPagedAsync(
                page: query.Page,
                pageSize: query.PageSize,
                artistId: query.ArtistId,
                releasedFrom: query.ReleasedFrom,
                releasedTo: query.ReleasedTo,
                keyword: query.Keyword,
                sortBy: query.SortBy,
                desc: query.Desc,
                includeDeleted: query.IncludeDeleted
            );

            var albumDtos = _mapper.Map<List<AlbumDto>>(items);

            return new PagedResult<AlbumDto>
            {
                Items = albumDtos,
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = totalCount
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetAlbumsAsync");
            throw;
        }
    }

    public async Task<AlbumDetailDto?> GetAlbumByIdAsync(long id, bool includeSongs = false)
    {
        try
        {
            var album = await _albumRepository.GetByIdAsync(id, includeDeleted: false, includeArtist: true, includeSongs: includeSongs);
            if (album == null)
            {
                return null;
            }

            return _mapper.Map<AlbumDetailDto>(album);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetAlbumByIdAsync for ID: {AlbumId}", id);
            throw;
        }
    }

    public async Task<AlbumDetailDto> CreateAlbumAsync(AlbumCreateDto createDto)
    {
        try
        {
            // Validate artist exists
            var artistExists = await _artistRepository.ExistsAsync(createDto.ArtistId);
            if (!artistExists)
            {
                throw new KeyNotFoundException($"Artist with ID {createDto.ArtistId} not found");
            }

            // Validate unique title per artist
            var titleExists = await _albumRepository.TitleExistsForArtistAsync(createDto.Title, createDto.ArtistId);
            if (titleExists)
            {
                throw new InvalidOperationException($"Album with title '{createDto.Title}' already exists for this artist");
            }

            var album = _mapper.Map<Album>(createDto);
            var createdAlbum = await _albumRepository.AddAsync(album);

            // Reload with artist info
            var albumWithDetails = await _albumRepository.GetByIdAsync(createdAlbum.AlbumId, includeArtist: true);

            return _mapper.Map<AlbumDetailDto>(albumWithDetails);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in CreateAlbumAsync");
            throw;
        }
    }

    public async Task<AlbumDetailDto> UpdateAlbumAsync(long id, AlbumUpdateDto updateDto)
    {
        try
        {
            var existingAlbum = await _albumRepository.GetByIdAsync(id, includeDeleted: false);
            if (existingAlbum == null)
            {
                throw new KeyNotFoundException($"Album with ID {id} not found");
            }

            // Validate artist exists if changing artist
            if (updateDto.ArtistId.HasValue && updateDto.ArtistId.Value != existingAlbum.ArtistId)
            {
                var artistExists = await _artistRepository.ExistsAsync(updateDto.ArtistId.Value);
                if (!artistExists)
                {
                    throw new KeyNotFoundException($"Artist with ID {updateDto.ArtistId.Value} not found");
                }
            }

            // Validate unique title per artist if changing title or artist
            var targetArtistId = updateDto.ArtistId ?? existingAlbum.ArtistId;
            var targetTitle = updateDto.Title ?? existingAlbum.Title;

            if (!string.IsNullOrWhiteSpace(updateDto.Title) || updateDto.ArtistId.HasValue)
            {
                var titleExists = await _albumRepository.TitleExistsForArtistAsync(targetTitle, targetArtistId, excludeId: id);
                if (titleExists)
                {
                    throw new InvalidOperationException($"Album with title '{targetTitle}' already exists for this artist");
                }
            }

            // Map only non-null properties
            if (!string.IsNullOrWhiteSpace(updateDto.Title))
                existingAlbum.Title = updateDto.Title;

            if (updateDto.ReleaseDate.HasValue)
                existingAlbum.ReleaseDate = updateDto.ReleaseDate;

            if (updateDto.CoverImageUrl != null)
                existingAlbum.CoverImageUrl = updateDto.CoverImageUrl;

            if (updateDto.Description != null)
                existingAlbum.Description = updateDto.Description;

            if (updateDto.ArtistId.HasValue)
                existingAlbum.ArtistId = updateDto.ArtistId.Value;

            if (updateDto.IsActive.HasValue)
                existingAlbum.IsActive = updateDto.IsActive;

            await _albumRepository.UpdateAsync(existingAlbum);

            // Reload with artist info
            var updatedAlbum = await _albumRepository.GetByIdAsync(id, includeArtist: true);

            return _mapper.Map<AlbumDetailDto>(updatedAlbum!);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in UpdateAlbumAsync for ID: {AlbumId}", id);
            throw;
        }
    }

    public async Task DeleteAlbumAsync(long id)
    {
        try
        {
            await _albumRepository.SoftDeleteAsync(id);
            _logger.LogInformation("Deleted album with ID: {AlbumId}", id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in DeleteAlbumAsync for ID: {AlbumId}", id);
            throw;
        }
    }

    public async Task RestoreAlbumAsync(long id)
    {
        try
        {
            await _albumRepository.RestoreAsync(id);
            _logger.LogInformation("Restored album with ID: {AlbumId}", id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in RestoreAlbumAsync for ID: {AlbumId}", id);
            throw;
        }
    }

    public async Task<IReadOnlyList<AlbumDetailDto.SongInfo>> GetAlbumSongsAsync(long id)
    {
        try
        {
            var album = await _albumRepository.GetByIdAsync(id, includeDeleted: false, includeArtist: false, includeSongs: true);
            if (album == null)
            {
                throw new KeyNotFoundException($"Album with ID {id} not found");
            }

            var songInfos = album.Songs
                .Where(s => s.DeletedAt == null)
                .OrderBy(s => s.Title)
                .Select(s => new AlbumDetailDto.SongInfo
                {
                    SongId = s.SongId,
                    Title = s.Title,
                    Duration = s.Duration,
                    CoverImageUrl = s.CoverImageUrl
                })
                .ToList();

            return songInfos;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetAlbumSongsAsync for ID: {AlbumId}", id);
            throw;
        }
    }

    public async Task RecalculateAlbumStatsAsync(long id)
    {
        try
        {
            await _albumRepository.RecalculateStatsAsync(id);
            _logger.LogInformation("Recalculated stats for album with ID: {AlbumId}", id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in RecalculateAlbumStatsAsync for ID: {AlbumId}", id);
            throw;
        }
    }
}
