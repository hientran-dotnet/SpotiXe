using AutoMapper;
using MusicStreamingAPI.DTOs.Songs;
using MusicStreamingAPI.Entities;

namespace MusicStreamingAPI.Mappings;

/// <summary>
/// AutoMapper profile for Song entity mappings
/// </summary>
public class SongMappingProfile : Profile
{
    public SongMappingProfile()
    {
        // Entity to DTOs
        CreateMap<Song, SongResponseDto>()
            .ForMember(dest => dest.PlayCount, opt => opt.MapFrom(src => src.PlayCount ?? 0))
            .ForMember(dest => dest.LikeCount, opt => opt.MapFrom(src => src.LikeCount ?? 0))
            .ForMember(dest => dest.ArtistName, opt => opt.MapFrom(src => src.Artist.Name))
            .ForMember(dest => dest.ArtistProfileImage, opt => opt.MapFrom(src => src.Artist.ProfileImageUrl))
            .ForMember(dest => dest.AlbumTitle, opt => opt.MapFrom(src => src.Album != null ? src.Album.Title : null))
            .ForMember(dest => dest.AlbumCoverImage, opt => opt.MapFrom(src => src.Album != null ? src.Album.CoverImageUrl : null))
            .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(src => src.IsPublic ?? true))
            .ForMember(dest => dest.HasCopyright, opt => opt.MapFrom(src => src.HasCopyright ?? true))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? true))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt ?? DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt ?? DateTime.UtcNow));

        CreateMap<Song, SongListDto>()
            .ForMember(dest => dest.PlayCount, opt => opt.MapFrom(src => src.PlayCount ?? 0))
            .ForMember(dest => dest.LikeCount, opt => opt.MapFrom(src => src.LikeCount ?? 0))
            .ForMember(dest => dest.ArtistName, opt => opt.MapFrom(src => src.Artist.Name))
            .ForMember(dest => dest.AlbumTitle, opt => opt.MapFrom(src => src.Album != null ? src.Album.Title : null))
            .ForMember(dest => dest.IsPublic, opt => opt.MapFrom(src => src.IsPublic ?? true))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? true));

        // DTOs to Entity
        CreateMap<SongCreateDto, Song>()
            .ForMember(dest => dest.SongId, opt => opt.Ignore())
            .ForMember(dest => dest.PlayCount, opt => opt.Ignore())
            .ForMember(dest => dest.LikeCount, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Artist, opt => opt.Ignore())
            .ForMember(dest => dest.Album, opt => opt.Ignore())
            .ForMember(dest => dest.PlaylistSongs, opt => opt.Ignore())
            .ForMember(dest => dest.SongStats, opt => opt.Ignore())
            .ForMember(dest => dest.StreamingSessions, opt => opt.Ignore())
            .ForMember(dest => dest.UserFavoriteSongs, opt => opt.Ignore())
            .ForMember(dest => dest.UserListeningHistories, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

        CreateMap<SongUpdateDto, Song>()
            .ForMember(dest => dest.SongId, opt => opt.Ignore())
            .ForMember(dest => dest.PlayCount, opt => opt.Ignore())
            .ForMember(dest => dest.LikeCount, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Artist, opt => opt.Ignore())
            .ForMember(dest => dest.Album, opt => opt.Ignore())
            .ForMember(dest => dest.PlaylistSongs, opt => opt.Ignore())
            .ForMember(dest => dest.SongStats, opt => opt.Ignore())
            .ForMember(dest => dest.StreamingSessions, opt => opt.Ignore())
            .ForMember(dest => dest.UserFavoriteSongs, opt => opt.Ignore())
            .ForMember(dest => dest.UserListeningHistories, opt => opt.Ignore());
    }
}
