using System;
using System.Collections.Generic;

namespace SpotiXeApi.Entities;

public partial class Playlist
{
    public long PlaylistId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? CoverImageUrl { get; set; }

    public long OwnerUserId { get; set; }

    public ulong? IsPublic { get; set; }

    public ulong IsActive { get; set; }

    public DateTime? DeletedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public long? CreatedById { get; set; }

    public string? CreatedByName { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public long? UpdatedById { get; set; }

    public string? UpdatedByName { get; set; }

    public virtual User OwnerUser { get; set; } = null!;

    public virtual ICollection<PlaylistSong> PlaylistSongs { get; set; } = new List<PlaylistSong>();

    public virtual ICollection<UserFollowedPlaylist> UserFollowedPlaylists { get; set; } = new List<UserFollowedPlaylist>();
}
