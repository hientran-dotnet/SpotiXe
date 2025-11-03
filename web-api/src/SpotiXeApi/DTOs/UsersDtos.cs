using System.ComponentModel.DataAnnotations;

namespace SpotiXeApi.DTOs;

public class CreateUserRequest
{
    [Required]
    public string Username { get; set; } = null!;

    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? FirebaseUid { get; set; }
    public string? AvatarUrl { get; set; }
}

public class UpdateUserRequest
{
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? FirebaseUid { get; set; }
    public string? AvatarUrl { get; set; }
}
