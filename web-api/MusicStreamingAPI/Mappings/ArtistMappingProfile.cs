using AutoMapper;
using MusicStreamingAPI.DTOs.Artists;
using MusicStreamingAPI.DTOs.Songs;
using MusicStreamingAPI.DTOs.Albums;
using MusicStreamingAPI.Entities;

namespace MusicStreamingAPI.Mappings;

/// <summary>
/// AutoMapper profile for Artist entity mappings
/// </summary>
public class ArtistMappingProfile : Profile
{
    public ArtistMappingProfile()
    {
        // Entity to DTOs
        CreateMap<Artist, ArtistResponse>()
            .ForMember(dest => dest.TotalFollowers, opt => opt.MapFrom(src => src.TotalFollowers ?? 0))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? true));

        CreateMap<Artist, ArtistDetailResponse>()
            .ForMember(dest => dest.TotalFollowers, opt => opt.MapFrom(src => src.TotalFollowers ?? 0))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? true))
            .ForMember(dest => dest.TotalSongs, opt => opt.Ignore())
            .ForMember(dest => dest.TotalAlbums, opt => opt.Ignore())
            .ForMember(dest => dest.RecentSongs, opt => opt.Ignore());

        // DTOs to Entity
        CreateMap<CreateArtistRequest, Artist>()
            .ForMember(dest => dest.ArtistId, opt => opt.Ignore())
            .ForMember(dest => dest.TotalFollowers, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Albums, opt => opt.Ignore())
            .ForMember(dest => dest.Songs, opt => opt.Ignore())
            .ForMember(dest => dest.UserFollowedArtists, opt => opt.Ignore());

        CreateMap<UpdateArtistRequest, Artist>()
            .ForMember(dest => dest.ArtistId, opt => opt.Ignore())
            .ForMember(dest => dest.TotalFollowers, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Albums, opt => opt.Ignore())
            .ForMember(dest => dest.Songs, opt => opt.Ignore())
            .ForMember(dest => dest.UserFollowedArtists, opt => opt.Ignore())
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // Song mappings for artist detail
        CreateMap<Song, SongResponse>()
            .ForMember(dest => dest.ArtistName, opt => opt.MapFrom(src => src.Artist != null ? src.Artist.Name : string.Empty))
            .ForMember(dest => dest.AlbumTitle, opt => opt.MapFrom(src => src.Album != null ? src.Album.Title : null))
            .ForMember(dest => dest.PlayCount, opt => opt.MapFrom(src => src.PlayCount ?? 0))
            .ForMember(dest => dest.LikeCount, opt => opt.MapFrom(src => src.LikeCount ?? 0))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? true));

        // Album mappings for artist detail
        CreateMap<Album, AlbumResponse>()
            .ForMember(dest => dest.ArtistName, opt => opt.MapFrom(src => src.Artist != null ? src.Artist.Name : string.Empty))
            .ForMember(dest => dest.TotalTracks, opt => opt.MapFrom(src => src.TotalTracks ?? 0))
            .ForMember(dest => dest.TotalDuration, opt => opt.MapFrom(src => src.TotalDuration ?? 0))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? true));
    }
}
