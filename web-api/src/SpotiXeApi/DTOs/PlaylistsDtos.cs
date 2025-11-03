using System.ComponentModel.DataAnnotations;

namespace SpotiXeApi.DTOs;

public class CreatePlaylistRequest
{
    [Required]
    public string Name { get; set; } = null!;

    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }

    [Required]
    public long? OwnerUserId { get; set; }

    public bool? IsPublic { get; set; }
}

public class UpdatePlaylistRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }
    public long? OwnerUserId { get; set; }
    public bool? IsPublic { get; set; }
}
