using Microsoft.AspNetCore.Mvc;
using MusicStreamingAPI.DTOs.Songs;
using MusicStreamingAPI.Services.Interfaces;

namespace MusicStreamingAPI.Controllers;

/// <summary>
/// API Controller for Song operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Tags("Songs")]
public class SongsController : ControllerBase
{
    private readonly ISongService _songService;
    private readonly ILogger<SongsController> _logger;

    public SongsController(ISongService songService, ILogger<SongsController> logger)
    {
        _songService = songService;
        _logger = logger;
    }

    /// <summary>
    /// Get all songs with pagination, filtering, and sorting
    /// </summary>
    /// <param name="query">Query parameters for filtering and pagination</param>
    /// <returns>Paged list of songs</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAllSongs([FromQuery] SongQueryDto query)
    {
        try
        {
            var result = await _songService.GetAllSongsAsync(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetAllSongs");
            return BadRequest(new { message = "An error occurred while retrieving songs", error = ex.Message });
        }
    }

    /// <summary>
    /// Get song by ID with full details
    /// </summary>
    /// <param name="id">Song ID</param>
    /// <returns>Song details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetSongById(long id)
    {
        try
        {
            var song = await _songService.GetSongByIdAsync(id);
            if (song == null)
            {
                return NotFound(new { message = $"Song with ID {id} not found" });
            }

            return Ok(song);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetSongById for ID: {SongId}", id);
            return BadRequest(new { message = "An error occurred while retrieving the song", error = ex.Message });
        }
    }

    /// <summary>
    /// Create a new song
    /// </summary>
    /// <param name="createDto">Song creation data</param>
    /// <returns>Created song</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateSong([FromBody] SongCreateDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdSong = await _songService.CreateSongAsync(createDto);
            return CreatedAtAction(nameof(GetSongById), new { id = createdSong.SongId }, createdSong);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error in CreateSong");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in CreateSong");
            return BadRequest(new { message = "An error occurred while creating the song", error = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing song
    /// </summary>
    /// <param name="id">Song ID</param>
    /// <param name="updateDto">Song update data</param>
    /// <returns>Updated song</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateSong(long id, [FromBody] SongUpdateDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedSong = await _songService.UpdateSongAsync(id, updateDto);
            if (updatedSong == null)
            {
                return NotFound(new { message = $"Song with ID {id} not found" });
            }

            return Ok(updatedSong);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error in UpdateSong for ID: {SongId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in UpdateSong for ID: {SongId}", id);
            return BadRequest(new { message = "An error occurred while updating the song", error = ex.Message });
        }
    }

    /// <summary>
    /// Delete a song (soft delete)
    /// </summary>
    /// <param name="id">Song ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteSong(long id)
    {
        try
        {
            var result = await _songService.DeleteSongAsync(id);
            if (!result)
            {
                return NotFound(new { message = $"Song with ID {id} not found" });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in DeleteSong for ID: {SongId}", id);
            return BadRequest(new { message = "An error occurred while deleting the song", error = ex.Message });
        }
    }

    /// <summary>
    /// Get all songs by artist
    /// </summary>
    /// <param name="artistId">Artist ID</param>
    /// <returns>List of songs by artist</returns>
    [HttpGet("artist/{artistId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSongsByArtist(long artistId)
    {
        try
        {
            var songs = await _songService.GetSongsByArtistAsync(artistId);
            return Ok(songs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetSongsByArtist for artist ID: {ArtistId}", artistId);
            return BadRequest(new { message = "An error occurred while retrieving songs", error = ex.Message });
        }
    }

    /// <summary>
    /// Get all songs by album
    /// </summary>
    /// <param name="albumId">Album ID</param>
    /// <returns>List of songs in album</returns>
    [HttpGet("album/{albumId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSongsByAlbum(long albumId)
    {
        try
        {
            var songs = await _songService.GetSongsByAlbumAsync(albumId);
            return Ok(songs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetSongsByAlbum for album ID: {AlbumId}", albumId);
            return BadRequest(new { message = "An error occurred while retrieving songs", error = ex.Message });
        }
    }

    /// <summary>
    /// Search songs by term
    /// </summary>
    /// <param name="q">Search query</param>
    /// <returns>List of matching songs</returns>
    [HttpGet("search")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SearchSongs([FromQuery] string q)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(q))
            {
                return BadRequest(new { message = "Search query cannot be empty" });
            }

            var songs = await _songService.SearchSongsAsync(q);
            return Ok(songs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in SearchSongs with query: {Query}", q);
            return BadRequest(new { message = "An error occurred while searching songs", error = ex.Message });
        }
    }

    /// <summary>
    /// Play a song (increment play count)
    /// </summary>
    /// <param name="id">Song ID</param>
    /// <returns>Success status</returns>
    [HttpPost("{id}/play")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> PlaySong(long id)
    {
        try
        {
            var result = await _songService.PlaySongAsync(id);
            if (!result)
            {
                return NotFound(new { message = $"Song with ID {id} not found" });
            }

            return Ok(new { message = "Play count incremented successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in PlaySong for ID: {SongId}", id);
            return BadRequest(new { message = "An error occurred while playing the song", error = ex.Message });
        }
    }

    /// <summary>
    /// Like a song (increment like count)
    /// </summary>
    /// <param name="id">Song ID</param>
    /// <returns>Success status</returns>
    [HttpPost("{id}/like")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> LikeSong(long id)
    {
        try
        {
            var result = await _songService.LikeSongAsync(id);
            if (!result)
            {
                return NotFound(new { message = $"Song with ID {id} not found" });
            }

            return Ok(new { message = "Song liked successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in LikeSong for ID: {SongId}", id);
            return BadRequest(new { message = "An error occurred while liking the song", error = ex.Message });
        }
    }

    /// <summary>
    /// Unlike a song (decrement like count)
    /// </summary>
    /// <param name="id">Song ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id}/like")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UnlikeSong(long id)
    {
        try
        {
            var result = await _songService.UnlikeSongAsync(id);
            if (!result)
            {
                return NotFound(new { message = $"Song with ID {id} not found" });
            }

            return Ok(new { message = "Song unliked successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in UnlikeSong for ID: {SongId}", id);
            return BadRequest(new { message = "An error occurred while unliking the song", error = ex.Message });
        }
    }
}
