using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("Email", Name = "IX_Users_Email")]
[Index("Username", Name = "IX_Users_Username")]
[Index("Username", Name = "UQ__Users__536C85E45EF19EAA", IsUnique = true)]
[Index("Email", Name = "UQ__Users__A9D105344CB1F624", IsUnique = true)]
public partial class User
{
    [Key]
    public long UserId { get; set; }

    [StringLength(100)]
    public string Username { get; set; } = null!;

    [StringLength(255)]
    public string Email { get; set; } = null!;

    [StringLength(255)]
    public string PasswordHash { get; set; } = null!;

    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    [StringLength(255)]
    public string? FullName { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    [StringLength(10)]
    public string? Gender { get; set; }

    [StringLength(500)]
    public string? AvatarUrl { get; set; }

    [StringLength(100)]
    public string? Country { get; set; }

    public long? CurrentPlanId { get; set; }

    public DateTime? SubscriptionStartDate { get; set; }

    public DateTime? SubscriptionEndDate { get; set; }

    public bool? IsActive { get; set; }

    public bool? EmailVerified { get; set; }

    public bool? PhoneVerified { get; set; }

    public DateTime? LastLoginAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    [ForeignKey("CurrentPlanId")]
    [InverseProperty("Users")]
    public virtual SubscriptionPlan? CurrentPlan { get; set; }

    [InverseProperty("User")]
    public virtual ICollection<DeviceSession> DeviceSessions { get; set; } = new List<DeviceSession>();

    [InverseProperty("User")]
    public virtual ICollection<ErrorLog> ErrorLogs { get; set; } = new List<ErrorLog>();

    [InverseProperty("User")]
    public virtual ICollection<PaymentTransaction> PaymentTransactions { get; set; } = new List<PaymentTransaction>();

    [InverseProperty("AddedByNavigation")]
    public virtual ICollection<PlaylistSong> PlaylistSongs { get; set; } = new List<PlaylistSong>();

    [InverseProperty("User")]
    public virtual ICollection<Playlist> Playlists { get; set; } = new List<Playlist>();

    [InverseProperty("User")]
    public virtual ICollection<StreamingSession> StreamingSessions { get; set; } = new List<StreamingSession>();

    [InverseProperty("User")]
    public virtual ICollection<UserActivityLog> UserActivityLogs { get; set; } = new List<UserActivityLog>();

    [InverseProperty("User")]
    public virtual ICollection<UserFavoriteSong> UserFavoriteSongs { get; set; } = new List<UserFavoriteSong>();

    [InverseProperty("User")]
    public virtual ICollection<UserFollowedArtist> UserFollowedArtists { get; set; } = new List<UserFollowedArtist>();

    [InverseProperty("User")]
    public virtual ICollection<UserFollowedPlaylist> UserFollowedPlaylists { get; set; } = new List<UserFollowedPlaylist>();

    [InverseProperty("User")]
    public virtual ICollection<UserListeningHistory> UserListeningHistories { get; set; } = new List<UserListeningHistory>();

    [InverseProperty("User")]
    public virtual ICollection<UserSubscriptionHistory> UserSubscriptionHistories { get; set; } = new List<UserSubscriptionHistory>();
}
