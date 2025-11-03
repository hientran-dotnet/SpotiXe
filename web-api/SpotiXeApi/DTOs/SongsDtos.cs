using System;
using System.ComponentModel.DataAnnotations;

namespace SpotiXeApi.DTOs;

public class CreateSongRequest
{
    [Required]
    public string Title { get; set; } = null!;

    public int? Duration { get; set; }
    public DateOnly? ReleaseDate { get; set; }
    public string? AudioFileUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? Genre { get; set; }

    [Required]
    public long? ArtistId { get; set; }

    public long? AlbumId { get; set; }
}

public class UpdateSongRequest
{
    public string? Title { get; set; }
    public int? Duration { get; set; }
    public DateOnly? ReleaseDate { get; set; }
    public string? AudioFileUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? Genre { get; set; }
    public long? ArtistId { get; set; }
    public long? AlbumId { get; set; }
}
