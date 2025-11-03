using System;
using System.Collections.Generic;

namespace SpotiXeApi.Entities;

public partial class Album
{
    public long AlbumId { get; set; }

    public string Title { get; set; } = null!;

    public long ArtistId { get; set; }

    public string? CoverImageUrl { get; set; }

    public DateOnly? ReleaseDate { get; set; }

    public ulong IsActive { get; set; }

    public DateTime? DeletedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public long? CreatedById { get; set; }

    public string? CreatedByName { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public long? UpdatedById { get; set; }

    public string? UpdatedByName { get; set; }

    public virtual Artist Artist { get; set; } = null!;

    public virtual ICollection<Song> Songs { get; set; } = new List<Song>();
}
