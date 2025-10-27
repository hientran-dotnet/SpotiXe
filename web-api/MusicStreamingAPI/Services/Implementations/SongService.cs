using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MusicStreamingAPI.DTOs.Common;
using MusicStreamingAPI.DTOs.Songs;
using MusicStreamingAPI.Entities;
using MusicStreamingAPI.Repositories.Interfaces;
using MusicStreamingAPI.Services.Interfaces;

namespace MusicStreamingAPI.Services.Implementations;

/// <summary>
/// Service implementation for Song business logic
/// </summary>
public class SongService : ISongService
{
    private readonly ISongRepository _songRepository;
    private readonly MusicStreamingDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<SongService> _logger;

    public SongService(
        ISongRepository songRepository,
        MusicStreamingDbContext context,
        IMapper mapper,
        ILogger<SongService> logger)
    {
        _songRepository = songRepository;
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PagedResult<SongListDto>> GetAllSongsAsync(SongQueryDto query)
    {
        try
        {
            var (songs, totalCount) = await _songRepository.GetAllAsync(query);
            var songDtos = _mapper.Map<List<SongListDto>>(songs);

            return new PagedResult<SongListDto>
            {
                Items = songDtos,
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = totalCount
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred in GetAllSongsAsync");
            throw;
        }
    }

    public async Task<SongResponseDto?> GetSongByIdAsync(long id)
    {
        try
        {
            var song = await _songRepository.GetByIdAsync(id, includeRelatedData: true);
            if (song == null)
            {
                return null;
            }

            return _mapper.Map<SongResponseDto>(song);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred in GetSongByIdAsync for ID: {SongId}", id);
            throw;
        }
    }

    public async Task<SongResponseDto> CreateSongAsync(SongCreateDto createDto)
    {
        try
        {
            // Validate artist exists
            var artistExists = await _context.Artists.AnyAsync(a => a.ArtistId == createDto.ArtistId && a.DeletedAt == null);
            if (!artistExists)
            {
                throw new ArgumentException($"Artist with ID {createDto.ArtistId} does not exist");
            }

            // Validate album if provided
            if (createDto.AlbumId.HasValue)
            {
                var album = await _context.Albums
                    .FirstOrDefaultAsync(a => a.AlbumId == createDto.AlbumId.Value && a.DeletedAt == null);

                if (album == null)
                {
                    throw new ArgumentException($"Album with ID {createDto.AlbumId.Value} does not exist");
                }

                // Validate album belongs to the same artist
                if (album.ArtistId != createDto.ArtistId)
                {
                    throw new ArgumentException($"Album does not belong to the specified artist");
                }
            }

            var song = _mapper.Map<Song>(createDto);
            var createdSong = await _songRepository.CreateAsync(song);

            // Reload with related data
            var songWithRelations = await _songRepository.GetByIdAsync(createdSong.SongId, includeRelatedData: true);

            return _mapper.Map<SongResponseDto>(songWithRelations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred in CreateSongAsync");
            throw;
        }
    }

    public async Task<SongResponseDto?> UpdateSongAsync(long id, SongUpdateDto updateDto)
    {
        try
        {
            var existingSong = await _songRepository.GetByIdAsync(id, includeRelatedData: false);
            if (existingSong == null)
            {
                return null;
            }

            // Validate artist exists
            var artistExists = await _context.Artists.AnyAsync(a => a.ArtistId == updateDto.ArtistId && a.DeletedAt == null);
            if (!artistExists)
            {
                throw new ArgumentException($"Artist with ID {updateDto.ArtistId} does not exist");
            }

            // Validate album if provided
            if (updateDto.AlbumId.HasValue)
            {
                var album = await _context.Albums
                    .FirstOrDefaultAsync(a => a.AlbumId == updateDto.AlbumId.Value && a.DeletedAt == null);

                if (album == null)
                {
                    throw new ArgumentException($"Album with ID {updateDto.AlbumId.Value} does not exist");
                }

                // Validate album belongs to the same artist
                if (album.ArtistId != updateDto.ArtistId)
                {
                    throw new ArgumentException($"Album does not belong to the specified artist");
                }
            }

            // Map updates to existing entity
            _mapper.Map(updateDto, existingSong);

            var updatedSong = await _songRepository.UpdateAsync(existingSong);

            // Reload with related data
            var songWithRelations = await _songRepository.GetByIdAsync(updatedSong.SongId, includeRelatedData: true);

            return _mapper.Map<SongResponseDto>(songWithRelations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred in UpdateSongAsync for ID: {SongId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteSongAsync(long id)
    {
        try
        {
            var exists = await _songRepository.ExistsAsync(id);
            if (!exists)
            {
                return false;
            }

            return await _songRepository.DeleteAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred in DeleteSongAsync for ID: {SongId}", id);
            throw;
        }
    }

    public async Task<IEnumerable<SongListDto>> GetSongsByArtistAsync(long artistId)
    {
        try
        {
            var songs = await _songRepository.GetByArtistIdAsync(artistId);
            return _mapper.Map<IEnumerable<SongListDto>>(songs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred in GetSongsByArtistAsync for artist ID: {ArtistId}", artistId);
            throw;
        }
    }

    public async Task<IEnumerable<SongListDto>> GetSongsByAlbumAsync(long albumId)
    {
        try
        {
            var songs = await _songRepository.GetByAlbumIdAsync(albumId);
            return _mapper.Map<IEnumerable<SongListDto>>(songs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred in GetSongsByAlbumAsync for album ID: {AlbumId}", albumId);
            throw;
        }
    }

    public async Task<IEnumerable<SongListDto>> SearchSongsAsync(string searchTerm)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return Enumerable.Empty<SongListDto>();
            }

            var songs = await _songRepository.SearchAsync(searchTerm);
            return _mapper.Map<IEnumerable<SongListDto>>(songs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred in SearchSongsAsync with term: {SearchTerm}", searchTerm);
            throw;
        }
    }

    public async Task<bool> PlaySongAsync(long songId)
    {
        try
        {
            var exists = await _songRepository.ExistsAsync(songId);
            if (!exists)
            {
                return false;
            }

            return await _songRepository.IncrementPlayCountAsync(songId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred in PlaySongAsync for ID: {SongId}", songId);
            throw;
        }
    }

    public async Task<bool> LikeSongAsync(long songId)
    {
        try
        {
            var exists = await _songRepository.ExistsAsync(songId);
            if (!exists)
            {
                return false;
            }

            return await _songRepository.IncrementLikeCountAsync(songId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred in LikeSongAsync for ID: {SongId}", songId);
            throw;
        }
    }

    public async Task<bool> UnlikeSongAsync(long songId)
    {
        try
        {
            var exists = await _songRepository.ExistsAsync(songId);
            if (!exists)
            {
                return false;
            }

            return await _songRepository.DecrementLikeCountAsync(songId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred in UnlikeSongAsync for ID: {SongId}", songId);
            throw;
        }
    }
}
