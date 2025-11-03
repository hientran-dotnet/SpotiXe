using System;
using System.Collections.Generic;

namespace SpotiXeApi.Entities;

public partial class Artist
{
    public long ArtistId { get; set; }

    public string Name { get; set; } = null!;

    public string? Bio { get; set; }

    public string? Country { get; set; }

    public string? ProfileImageUrl { get; set; }

    public ulong IsActive { get; set; }

    public DateTime? DeletedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public long? CreatedById { get; set; }

    public string? CreatedByName { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public long? UpdatedById { get; set; }

    public string? UpdatedByName { get; set; }

    public virtual ICollection<Album> Albums { get; set; } = new List<Album>();

    public virtual ICollection<Song> Songs { get; set; } = new List<Song>();
}
