using Microsoft.AspNetCore.Mvc;
using MusicStreamingAPI.DTOs.Albums;
using MusicStreamingAPI.Services.Interfaces;

namespace MusicStreamingAPI.Controllers;

/// <summary>
/// API Controller for Album operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Tags("Albums")]
public class AlbumsController : ControllerBase
{
    private readonly IAlbumService _albumService;
    private readonly ILogger<AlbumsController> _logger;

    public AlbumsController(IAlbumService albumService, ILogger<AlbumsController> logger)
    {
        _albumService = albumService;
        _logger = logger;
    }

    /// <summary>
    /// Get all albums with pagination, filtering, and sorting
    /// </summary>
    /// <param name="query">Query parameters for filtering and pagination</param>
    /// <returns>Paged list of albums</returns>
    /// <remarks>
    /// Sample request:
    ///     GET /api/albums?page=1&amp;pageSize=20&amp;artistId=123&amp;keyword=hybrid&amp;sortBy=releaseDate&amp;desc=false
    /// </remarks>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAlbums([FromQuery] AlbumQueryDto query)
    {
        try
        {
            var result = await _albumService.GetAlbumsAsync(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetAlbums");
            return BadRequest(new { message = "An error occurred while retrieving albums", error = ex.Message });
        }
    }

    /// <summary>
    /// Get album by ID with full details
    /// </summary>
    /// <param name="id">Album ID</param>
    /// <param name="includeSongs">Include album tracks in response</param>
    /// <returns>Album details</returns>
    /// <remarks>
    /// Sample request:
    ///     GET /api/albums/1?includeSongs=true
    /// </remarks>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAlbumById(long id, [FromQuery] bool includeSongs = false)
    {
        try
        {
            var album = await _albumService.GetAlbumByIdAsync(id, includeSongs);
            if (album == null)
            {
                return NotFound(new { message = $"Album with ID {id} not found" });
            }

            return Ok(album);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetAlbumById for ID: {AlbumId}", id);
            return BadRequest(new { message = "An error occurred while retrieving the album", error = ex.Message });
        }
    }

    /// <summary>
    /// Create a new album
    /// </summary>
    /// <param name="createDto">Album creation data</param>
    /// <returns>Created album</returns>
    /// <remarks>
    /// Sample request:
    ///     POST /api/albums
    ///     {
    ///       "title": "Hybrid Theory",
    ///       "releaseDate": "2000-10-24",
    ///       "coverImageUrl": "https://cdn.example.com/covers/hybrid-theory.jpg",
    ///       "description": "Debut studio album by Linkin Park",
    ///       "artistId": 123,
    ///       "isActive": true
    ///     }
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAlbum([FromBody] AlbumCreateDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdAlbum = await _albumService.CreateAlbumAsync(createDto);
            return CreatedAtAction(nameof(GetAlbumById), new { id = createdAlbum.AlbumId }, createdAlbum);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Not found error in CreateAlbum");
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Validation error in CreateAlbum");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in CreateAlbum");
            return BadRequest(new { message = "An error occurred while creating the album", error = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing album
    /// </summary>
    /// <param name="id">Album ID</param>
    /// <param name="updateDto">Album update data</param>
    /// <returns>Updated album</returns>
    /// <remarks>
    /// Sample request:
    ///     PUT /api/albums/1
    ///     {
    ///       "title": "Hybrid Theory (Remastered)",
    ///       "coverImageUrl": "https://cdn.example.com/covers/hybrid-theory-remaster.jpg"
    ///     }
    /// </remarks>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateAlbum(long id, [FromBody] AlbumUpdateDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedAlbum = await _albumService.UpdateAlbumAsync(id, updateDto);
            return Ok(updatedAlbum);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Not found error in UpdateAlbum for ID: {AlbumId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Validation error in UpdateAlbum for ID: {AlbumId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in UpdateAlbum for ID: {AlbumId}", id);
            return BadRequest(new { message = "An error occurred while updating the album", error = ex.Message });
        }
    }

    /// <summary>
    /// Delete an album (soft delete)
    /// </summary>
    /// <param name="id">Album ID</param>
    /// <returns>No content</returns>
    /// <remarks>
    /// Sample request:
    ///     DELETE /api/albums/1
    /// </remarks>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAlbum(long id)
    {
        try
        {
            await _albumService.DeleteAlbumAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Not found error in DeleteAlbum for ID: {AlbumId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in DeleteAlbum for ID: {AlbumId}", id);
            return BadRequest(new { message = "An error occurred while deleting the album", error = ex.Message });
        }
    }

    /// <summary>
    /// Restore a soft-deleted album
    /// </summary>
    /// <param name="id">Album ID</param>
    /// <returns>No content</returns>
    /// <remarks>
    /// Sample request:
    ///     POST /api/albums/1/restore
    /// </remarks>
    [HttpPost("{id}/restore")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RestoreAlbum(long id)
    {
        try
        {
            await _albumService.RestoreAlbumAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Not found error in RestoreAlbum for ID: {AlbumId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Validation error in RestoreAlbum for ID: {AlbumId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in RestoreAlbum for ID: {AlbumId}", id);
            return BadRequest(new { message = "An error occurred while restoring the album", error = ex.Message });
        }
    }

    /// <summary>
    /// Get all songs in an album
    /// </summary>
    /// <param name="id">Album ID</param>
    /// <returns>List of songs in the album</returns>
    /// <remarks>
    /// Sample request:
    ///     GET /api/albums/1/songs
    /// </remarks>
    [HttpGet("{id}/songs")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAlbumSongs(long id)
    {
        try
        {
            var songs = await _albumService.GetAlbumSongsAsync(id);
            return Ok(songs);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Not found error in GetAlbumSongs for ID: {AlbumId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetAlbumSongs for ID: {AlbumId}", id);
            return BadRequest(new { message = "An error occurred while retrieving album songs", error = ex.Message });
        }
    }

    /// <summary>
    /// Recalculate album statistics (total tracks and duration from songs)
    /// </summary>
    /// <param name="id">Album ID</param>
    /// <returns>No content</returns>
    /// <remarks>
    /// Sample request:
    ///     POST /api/albums/1/recalculate
    /// </remarks>
    [HttpPost("{id}/recalculate")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RecalculateAlbumStats(long id)
    {
        try
        {
            await _albumService.RecalculateAlbumStatsAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Not found error in RecalculateAlbumStats for ID: {AlbumId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in RecalculateAlbumStats for ID: {AlbumId}", id);
            return BadRequest(new { message = "An error occurred while recalculating album stats", error = ex.Message });
        }
    }
}
