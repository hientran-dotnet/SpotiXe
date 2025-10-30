using AutoMapper;
using MusicStreamingAPI.DTOs.Albums;
using MusicStreamingAPI.Entities;

namespace MusicStreamingAPI.Mappings;

/// <summary>
/// AutoMapper profile for Album entity mappings
/// </summary>
public class AlbumMappingProfile : Profile
{
    public AlbumMappingProfile()
    {
        // Entity to DTOs
        CreateMap<Album, AlbumDto>()
            .ForMember(dest => dest.ArtistName, opt => opt.MapFrom(src => src.Artist.Name))
            .ForMember(dest => dest.TotalTracks, opt => opt.MapFrom(src => src.TotalTracks ?? 0))
            .ForMember(dest => dest.TotalDuration, opt => opt.MapFrom(src => src.TotalDuration ?? 0))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? true));

        CreateMap<Album, AlbumDetailDto>()
            .ForMember(dest => dest.TotalTracks, opt => opt.MapFrom(src => src.TotalTracks ?? 0))
            .ForMember(dest => dest.TotalDuration, opt => opt.MapFrom(src => src.TotalDuration ?? 0))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? true))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt ?? DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt ?? DateTime.UtcNow))
            .ForMember(dest => dest.Artist, opt => opt.MapFrom(src => src.Artist))
            .ForMember(dest => dest.Tracks, opt => opt.MapFrom(src => src.Songs.Where(s => s.DeletedAt == null)));

        CreateMap<Artist, AlbumDetailDto.ArtistInfo>()
            .ForMember(dest => dest.ProfileImageUrl, opt => opt.MapFrom(src => src.ProfileImageUrl));

        CreateMap<Song, AlbumDetailDto.SongInfo>()
            .ForMember(dest => dest.CoverImageUrl, opt => opt.MapFrom(src => src.CoverImageUrl));

        // DTOs to Entity
        CreateMap<AlbumCreateDto, Album>()
            .ForMember(dest => dest.AlbumId, opt => opt.Ignore())
            .ForMember(dest => dest.TotalTracks, opt => opt.Ignore())
            .ForMember(dest => dest.TotalDuration, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Artist, opt => opt.Ignore())
            .ForMember(dest => dest.Songs, opt => opt.Ignore());

        CreateMap<AlbumUpdateDto, Album>()
            .ForMember(dest => dest.AlbumId, opt => opt.Ignore())
            .ForMember(dest => dest.TotalTracks, opt => opt.Ignore())
            .ForMember(dest => dest.TotalDuration, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Artist, opt => opt.Ignore())
            .ForMember(dest => dest.Songs, opt => opt.Ignore())
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
