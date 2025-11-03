using System;
using System.ComponentModel.DataAnnotations;

namespace SpotiXeApi.DTOs;

public class CreateAlbumRequest
{
    [Required]
    public string Title { get; set; } = null!;

    [Required]
    public long? ArtistId { get; set; }

    public string? CoverImageUrl { get; set; }

    public DateOnly? ReleaseDate { get; set; }
}

public class UpdateAlbumRequest
{
    public string? Title { get; set; }
    public long? ArtistId { get; set; }
    public string? CoverImageUrl { get; set; }
    public DateOnly? ReleaseDate { get; set; }
}
