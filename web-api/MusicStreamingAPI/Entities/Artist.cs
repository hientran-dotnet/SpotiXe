using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

[Index("Country", Name = "IX_Artists_Country")]
[Index("Name", Name = "IX_Artists_Name")]
[Index("TotalFollowers", Name = "IX_Artists_TotalFollowers", AllDescending = true)]
public partial class Artist
{
    [Key]
    public long ArtistId { get; set; }

    [StringLength(255)]
    public string Name { get; set; } = null!;

    public string? Bio { get; set; }

    [StringLength(500)]
    public string? ProfileImageUrl { get; set; }

    [StringLength(100)]
    public string? Country { get; set; }

    public int? DebutYear { get; set; }

    public long? TotalFollowers { get; set; }

    public bool? IsActive { get; set; }


    public DateTime? CreatedAt { get; set; }

    public long? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public long? UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }

    public long? DeletedBy { get; set; }

    [InverseProperty("Artist")]
    public virtual ICollection<Album> Albums { get; set; } = new List<Album>();

    [InverseProperty("Artist")]
    public virtual ICollection<Song> Songs { get; set; } = new List<Song>();

    [InverseProperty("Artist")]
    public virtual ICollection<UserFollowedArtist> UserFollowedArtists { get; set; } = new List<UserFollowedArtist>();
}
