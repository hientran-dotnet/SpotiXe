using Microsoft.AspNetCore.Mvc;
using MusicStreamingAPI.DTOs.Artists;
using MusicStreamingAPI.DTOs.Common;
using MusicStreamingAPI.DTOs.Songs;
using MusicStreamingAPI.DTOs.Albums;
using MusicStreamingAPI.Services.Interfaces;

namespace MusicStreamingAPI.Controllers;

/// <summary>
/// API Controller for Artist operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Tags("Artists")]
public class ArtistsController : ControllerBase
{
    private readonly IArtistService _artistService;
    private readonly ILogger<ArtistsController> _logger;

    public ArtistsController(IArtistService artistService, ILogger<ArtistsController> logger)
    {
        _artistService = artistService;
        _logger = logger;
    }

    /// <summary>
    /// Get all artists with pagination and filtering
    /// </summary>
    /// <param name="queryParams">Query parameters for filtering, sorting, and pagination</param>
    /// <returns>Paged list of artists</returns>
    /// <response code="200">Returns the paged list of artists</response>
    /// <response code="400">If the query parameters are invalid</response>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<ArtistResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PagedResult<ArtistResponse>>> GetAllArtists([FromQuery] ArtistQueryParameters queryParams)
    {
        try
        {
            var result = await _artistService.GetAllArtistsAsync(queryParams);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetAllArtists");
            return BadRequest(new { message = "An error occurred while retrieving artists", error = ex.Message });
        }
    }

    /// <summary>
    /// Get artist by ID with full details and statistics
    /// </summary>
    /// <param name="id">Artist ID</param>
    /// <returns>Artist details including recent songs and stats</returns>
    /// <response code="200">Returns the artist details</response>
    /// <response code="404">If the artist is not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ArtistDetailResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ArtistDetailResponse>> GetArtistById(long id)
    {
        try
        {
            var artist = await _artistService.GetArtistByIdAsync(id);
            if (artist == null)
            {
                return NotFound(new { message = $"Artist with ID {id} not found" });
            }

            return Ok(artist);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetArtistById for ID: {ArtistId}", id);
            return BadRequest(new { message = "An error occurred while retrieving the artist", error = ex.Message });
        }
    }

    /// <summary>
    /// Create a new artist
    /// </summary>
    /// <param name="request">Artist creation data</param>
    /// <returns>Created artist</returns>
    /// <response code="201">Returns the newly created artist</response>
    /// <response code="400">If the request is invalid or artist name already exists</response>
    [HttpPost]
    [ProducesResponseType(typeof(ArtistResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ArtistResponse>> CreateArtist([FromBody] CreateArtistRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdArtist = await _artistService.CreateArtistAsync(request);
            return CreatedAtAction(nameof(GetArtistById), new { id = createdArtist.ArtistId }, createdArtist);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error in CreateArtist");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in CreateArtist");
            return BadRequest(new { message = "An error occurred while creating the artist", error = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing artist
    /// </summary>
    /// <param name="id">Artist ID</param>
    /// <param name="request">Artist update data</param>
    /// <returns>Updated artist</returns>
    /// <response code="200">Returns the updated artist</response>
    /// <response code="404">If the artist is not found</response>
    /// <response code="400">If the request is invalid</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ArtistResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ArtistResponse>> UpdateArtist(long id, [FromBody] UpdateArtistRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedArtist = await _artistService.UpdateArtistAsync(id, request);
            return Ok(updatedArtist);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Artist not found in UpdateArtist for ID: {ArtistId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error in UpdateArtist for ID: {ArtistId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in UpdateArtist for ID: {ArtistId}", id);
            return BadRequest(new { message = "An error occurred while updating the artist", error = ex.Message });
        }
    }

    /// <summary>
    /// Delete an artist (soft delete)
    /// </summary>
    /// <param name="id">Artist ID</param>
    /// <returns>No content</returns>
    /// <response code="204">If the artist was successfully deleted</response>
    /// <response code="404">If the artist is not found</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteArtist(long id)
    {
        try
        {
            var result = await _artistService.DeleteArtistAsync(id);
            if (!result)
            {
                return NotFound(new { message = $"Artist with ID {id} not found" });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in DeleteArtist for ID: {ArtistId}", id);
            return BadRequest(new { message = "An error occurred while deleting the artist", error = ex.Message });
        }
    }

    /// <summary>
    /// Get all songs by a specific artist
    /// </summary>
    /// <param name="id">Artist ID</param>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20, max: 100)</param>
    /// <param name="sortBy">Sort by field: playCount, releaseDate, likeCount, title (default: createdAt)</param>
    /// <returns>Paged list of songs by the artist</returns>
    /// <response code="200">Returns the paged list of songs</response>
    /// <response code="404">If the artist is not found</response>
    [HttpGet("{id}/songs")]
    [ProducesResponseType(typeof(PagedResult<SongResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PagedResult<SongResponse>>> GetArtistSongs(
        long id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? sortBy = null)
    {
        try
        {
            var result = await _artistService.GetArtistSongsAsync(id, page, pageSize, sortBy);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Artist not found in GetArtistSongs for ID: {ArtistId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetArtistSongs for ID: {ArtistId}", id);
            return BadRequest(new { message = "An error occurred while retrieving artist songs", error = ex.Message });
        }
    }

    /// <summary>
    /// Get all albums by a specific artist
    /// </summary>
    /// <param name="id">Artist ID</param>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20, max: 100)</param>
    /// <returns>Paged list of albums by the artist</returns>
    /// <response code="200">Returns the paged list of albums</response>
    /// <response code="404">If the artist is not found</response>
    [HttpGet("{id}/albums")]
    [ProducesResponseType(typeof(PagedResult<AlbumResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PagedResult<AlbumResponse>>> GetArtistAlbums(
        long id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var result = await _artistService.GetArtistAlbumsAsync(id, page, pageSize);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Artist not found in GetArtistAlbums for ID: {ArtistId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetArtistAlbums for ID: {ArtistId}", id);
            return BadRequest(new { message = "An error occurred while retrieving artist albums", error = ex.Message });
        }
    }

    /// <summary>
    /// Get statistics for a specific artist
    /// </summary>
    /// <param name="id">Artist ID</param>
    /// <returns>Artist statistics including total songs, albums, followers, and plays</returns>
    /// <response code="200">Returns the artist statistics</response>
    /// <response code="404">If the artist is not found</response>
    [HttpGet("{id}/statistics")]
    [ProducesResponseType(typeof(ArtistStatisticsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ArtistStatisticsResponse>> GetArtistStatistics(long id)
    {
        try
        {
            var statistics = await _artistService.GetArtistStatisticsAsync(id);
            if (statistics == null)
            {
                return NotFound(new { message = $"Artist with ID {id} not found" });
            }

            return Ok(statistics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetArtistStatistics for ID: {ArtistId}", id);
            return BadRequest(new { message = "An error occurred while retrieving artist statistics", error = ex.Message });
        }
    }

    /// <summary>
    /// Get trending artists based on recent plays
    /// </summary>
    /// <param name="limit">Number of artists to return (default: 10, max: 100)</param>
    /// <returns>List of trending artists</returns>
    /// <response code="200">Returns the list of trending artists</response>
    [HttpGet("trending")]
    [ProducesResponseType(typeof(List<ArtistResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<ArtistResponse>>> GetTrendingArtists([FromQuery] int limit = 10)
    {
        try
        {
            var trendingArtists = await _artistService.GetTrendingArtistsAsync(limit);
            return Ok(trendingArtists);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetTrendingArtists");
            return BadRequest(new { message = "An error occurred while retrieving trending artists", error = ex.Message });
        }
    }

    /// <summary>
    /// Get top artists by follower count
    /// </summary>
    /// <param name="limit">Number of artists to return (default: 50, max: 100)</param>
    /// <returns>List of top artists</returns>
    /// <response code="200">Returns the list of top artists</response>
    [HttpGet("top")]
    [ProducesResponseType(typeof(List<ArtistResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<ArtistResponse>>> GetTopArtists([FromQuery] int limit = 50)
    {
        try
        {
            var topArtists = await _artistService.GetTopArtistsAsync(limit);
            return Ok(topArtists);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetTopArtists");
            return BadRequest(new { message = "An error occurred while retrieving top artists", error = ex.Message });
        }
    }
}
