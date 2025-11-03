using System.ComponentModel.DataAnnotations;

namespace SpotiXeApi.DTOs;

public class CreateArtistRequest
{
    [Required]
    public string Name { get; set; } = null!;

    public string? Bio { get; set; }
    public string? Country { get; set; }
    public string? ProfileImageUrl { get; set; }
}

public class UpdateArtistRequest
{
    public string? Name { get; set; }
    public string? Bio { get; set; }
    public string? Country { get; set; }
    public string? ProfileImageUrl { get; set; }
}
