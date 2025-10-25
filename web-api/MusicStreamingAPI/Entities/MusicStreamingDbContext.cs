using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MusicStreamingAPI.Entities;

public partial class MusicStreamingDbContext : DbContext
{
    public MusicStreamingDbContext(DbContextOptions<MusicStreamingDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Album> Albums { get; set; }

    public virtual DbSet<Artist> Artists { get; set; }

    public virtual DbSet<DailyStat> DailyStats { get; set; }

    public virtual DbSet<DeviceSession> DeviceSessions { get; set; }

    public virtual DbSet<ErrorLog> ErrorLogs { get; set; }

    public virtual DbSet<PaymentTransaction> PaymentTransactions { get; set; }

    public virtual DbSet<Playlist> Playlists { get; set; }

    public virtual DbSet<PlaylistSong> PlaylistSongs { get; set; }

    public virtual DbSet<Song> Songs { get; set; }

    public virtual DbSet<SongStat> SongStats { get; set; }

    public virtual DbSet<StreamingSession> StreamingSessions { get; set; }

    public virtual DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserActivityLog> UserActivityLogs { get; set; }

    public virtual DbSet<UserFavoriteSong> UserFavoriteSongs { get; set; }

    public virtual DbSet<UserFollowedArtist> UserFollowedArtists { get; set; }

    public virtual DbSet<UserFollowedPlaylist> UserFollowedPlaylists { get; set; }

    public virtual DbSet<UserListeningHistory> UserListeningHistories { get; set; }

    public virtual DbSet<UserSubscriptionHistory> UserSubscriptionHistories { get; set; }

    public virtual DbSet<VwActiveUser> VwActiveUsers { get; set; }

    public virtual DbSet<VwAlbumDetail> VwAlbumDetails { get; set; }

    public virtual DbSet<VwPopularPlaylist> VwPopularPlaylists { get; set; }

    public virtual DbSet<VwPremiumUsersStat> VwPremiumUsersStats { get; set; }

    public virtual DbSet<VwRevenueSummary> VwRevenueSummaries { get; set; }

    public virtual DbSet<VwSongsByGenre> VwSongsByGenres { get; set; }

    public virtual DbSet<VwTop100Song> VwTop100Songs { get; set; }

    public virtual DbSet<VwTopArtistsByPlay> VwTopArtistsByPlays { get; set; }

    public virtual DbSet<VwTrendingSong> VwTrendingSongs { get; set; }

    public virtual DbSet<VwUserListeningSummary> VwUserListeningSummaries { get; set; }

    public virtual DbSet<VwUserSubscriptionSummary> VwUserSubscriptionSummaries { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Album>(entity =>
        {
            entity.HasKey(e => e.AlbumId).HasName("PK__Albums__97B4BE374CF95FA8");

            entity.ToTable(tb => tb.HasTrigger("TR_Albums_UpdatedAt"));

            entity.HasIndex(e => e.IsActive, "IX_Albums_IsActive").HasFilter("([DeletedAt] IS NULL)");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.TotalDuration).HasDefaultValue(0);
            entity.Property(e => e.TotalTracks).HasDefaultValue(0);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Artist).WithMany(p => p.Albums).HasConstraintName("FK_Albums_Artists");
        });

        modelBuilder.Entity<Artist>(entity =>
        {
            entity.HasKey(e => e.ArtistId).HasName("PK__Artists__25706B503C560F3A");

            entity.ToTable(tb => tb.HasTrigger("TR_Artists_UpdatedAt"));

            entity.HasIndex(e => e.IsActive, "IX_Artists_IsActive").HasFilter("([DeletedAt] IS NULL)");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.TotalFollowers).HasDefaultValue(0L);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<DailyStat>(entity =>
        {
            entity.HasKey(e => e.StatId).HasName("PK__DailySta__3A162D3EF90D0504");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Revenue).HasDefaultValue(0.00m);
            entity.Property(e => e.TotalActiveUsers).HasDefaultValue(0L);
            entity.Property(e => e.TotalNewUsers).HasDefaultValue(0L);
            entity.Property(e => e.TotalPlays).HasDefaultValue(0L);
            entity.Property(e => e.TotalPremiumUsers).HasDefaultValue(0L);
            entity.Property(e => e.TotalUsers).HasDefaultValue(0L);
        });

        modelBuilder.Entity<DeviceSession>(entity =>
        {
            entity.HasKey(e => e.SessionId).HasName("PK__DeviceSe__C9F492905DE5D137");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.LastActivityAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.User).WithMany(p => p.DeviceSessions).HasConstraintName("FK_DeviceSession_Users");
        });

        modelBuilder.Entity<ErrorLog>(entity =>
        {
            entity.HasKey(e => e.ErrorLogId).HasName("PK__ErrorLog__D65247C28AECA02D");

            entity.HasIndex(e => e.UserId, "IX_ErrorLogs_UserId").HasFilter("([UserId] IS NOT NULL)");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.User).WithMany(p => p.ErrorLogs)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_ErrorLogs_Users");
        });

        modelBuilder.Entity<PaymentTransaction>(entity =>
        {
            entity.HasKey(e => e.TransactionId).HasName("PK__PaymentT__55433A6B7C014827");

            entity.ToTable(tb =>
                {
                    tb.HasTrigger("TR_PaymentTransactions_UpdatedAt");
                    tb.HasTrigger("TR_Payment_UpdateSubscription");
                });

            entity.HasIndex(e => e.PaymentGatewayTransactionId, "IX_Payment_GatewayTxId").HasFilter("([PaymentGatewayTransactionId] IS NOT NULL)");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Currency).HasDefaultValue("VND");
            entity.Property(e => e.PaymentDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.TransactionStatus).HasDefaultValue("pending");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Plan).WithMany(p => p.PaymentTransactions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Payment_Plans");

            entity.HasOne(d => d.User).WithMany(p => p.PaymentTransactions).HasConstraintName("FK_Payment_Users");
        });

        modelBuilder.Entity<Playlist>(entity =>
        {
            entity.HasKey(e => e.PlaylistId).HasName("PK__Playlist__B30167A0DD83C2DF");

            entity.ToTable(tb => tb.HasTrigger("TR_Playlists_UpdatedAt"));

            entity.HasIndex(e => e.FollowerCount, "IX_Playlists_FollowerCount")
                .IsDescending()
                .HasFilter("([IsPublic]=(1))");

            entity.HasIndex(e => e.IsPublic, "IX_Playlists_IsPublic").HasFilter("([DeletedAt] IS NULL)");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.FollowerCount).HasDefaultValue(0L);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsPublic).HasDefaultValue(false);
            entity.Property(e => e.IsSystemGenerated).HasDefaultValue(false);
            entity.Property(e => e.PlaylistType).HasDefaultValue("user_created");
            entity.Property(e => e.TotalDuration).HasDefaultValue(0);
            entity.Property(e => e.TotalSongs).HasDefaultValue(0);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.User).WithMany(p => p.Playlists).HasConstraintName("FK_Playlists_Users");
        });

        modelBuilder.Entity<PlaylistSong>(entity =>
        {
            entity.HasKey(e => e.PlaylistSongId).HasName("PK__Playlist__D58F7B2EB9AC35BC");

            entity.ToTable(tb => tb.HasTrigger("TR_PlaylistSongs_UpdatePlaylistStats"));

            entity.HasIndex(e => e.AddedBy, "IX_PlaylistSongs_AddedBy").HasFilter("([AddedBy] IS NOT NULL)");

            entity.Property(e => e.AddedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.AddedByNavigation).WithMany(p => p.PlaylistSongs).HasConstraintName("FK_PlaylistSongs_Users");

            entity.HasOne(d => d.Playlist).WithMany(p => p.PlaylistSongs).HasConstraintName("FK_PlaylistSongs_Playlists");

            entity.HasOne(d => d.Song).WithMany(p => p.PlaylistSongs).HasConstraintName("FK_PlaylistSongs_Songs");
        });

        modelBuilder.Entity<Song>(entity =>
        {
            entity.HasKey(e => e.SongId).HasName("PK__Songs__12E3D6970064B767");

            entity.ToTable(tb =>
                {
                    tb.HasTrigger("TR_Songs_UpdateAlbumStats");
                    tb.HasTrigger("TR_Songs_UpdatedAt");
                });

            entity.HasIndex(e => e.AlbumId, "IX_Songs_AlbumId").HasFilter("([AlbumId] IS NOT NULL)");

            entity.HasIndex(e => new { e.AlbumId, e.Genre }, "IX_Songs_Album_Genre").HasFilter("([AlbumId] IS NOT NULL)");

            entity.HasIndex(e => new { e.IsPublic, e.IsActive }, "IX_Songs_IsPublic").HasFilter("([DeletedAt] IS NULL)");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.HasCopyright).HasDefaultValue(true);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsPublic).HasDefaultValue(true);
            entity.Property(e => e.LikeCount).HasDefaultValue(0L);
            entity.Property(e => e.PlayCount).HasDefaultValue(0L);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Album).WithMany(p => p.Songs).HasConstraintName("FK_Songs_Albums");

            entity.HasOne(d => d.Artist).WithMany(p => p.Songs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Songs_Artists");
        });

        modelBuilder.Entity<SongStat>(entity =>
        {
            entity.HasKey(e => e.SongStatId).HasName("PK__SongStat__6A757F507E0CE7A6");

            entity.Property(e => e.PlayCount).HasDefaultValue(0L);
            entity.Property(e => e.SkipCount).HasDefaultValue(0L);
            entity.Property(e => e.UniqueListeners).HasDefaultValue(0L);

            entity.HasOne(d => d.Song).WithMany(p => p.SongStats).HasConstraintName("FK_SongStats_Songs");
        });

        modelBuilder.Entity<StreamingSession>(entity =>
        {
            entity.HasKey(e => e.StreamingSessionId).HasName("PK__Streamin__D9A2203BEB0C3925");

            entity.Property(e => e.BytesStreamed).HasDefaultValue(0L);
            entity.Property(e => e.StartTime).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.DeviceSession).WithMany(p => p.StreamingSessions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Streaming_DeviceSession");

            entity.HasOne(d => d.Song).WithMany(p => p.StreamingSessions).HasConstraintName("FK_Streaming_Songs");

            entity.HasOne(d => d.User).WithMany(p => p.StreamingSessions).HasConstraintName("FK_Streaming_Users");
        });

        modelBuilder.Entity<SubscriptionPlan>(entity =>
        {
            entity.HasKey(e => e.PlanId).HasName("PK__Subscrip__755C22B7B91810F5");

            entity.ToTable(tb => tb.HasTrigger("TR_SubscriptionPlans_UpdatedAt"));

            entity.Property(e => e.CanSkipUnlimited).HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsAdFree).HasDefaultValue(false);
            entity.Property(e => e.MaxOfflineDownloads).HasDefaultValue(0);
            entity.Property(e => e.StreamingQuality).HasDefaultValue("medium");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C56E3F47E");

            entity.ToTable(tb =>
                {
                    tb.HasTrigger("TR_Users_LogLogin");
                    tb.HasTrigger("TR_Users_UpdatedAt");
                });

            entity.HasIndex(e => e.CurrentPlanId, "IX_Users_CurrentPlanId").HasFilter("([CurrentPlanId] IS NOT NULL)");

            entity.HasIndex(e => e.IsActive, "IX_Users_IsActive").HasFilter("([DeletedAt] IS NULL)");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.EmailVerified).HasDefaultValue(false);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.PhoneVerified).HasDefaultValue(false);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.CurrentPlan).WithMany(p => p.Users)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_Users_SubscriptionPlans");
        });

        modelBuilder.Entity<UserActivityLog>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__UserActi__5E5486485CBF812B");

            entity.HasIndex(e => e.UserId, "IX_ActivityLogs_UserId").HasFilter("([UserId] IS NOT NULL)");

            entity.HasIndex(e => new { e.UserId, e.ActivityType, e.CreatedAt }, "IX_ActivityLogs_User_Type_Date")
                .IsDescending(false, false, true)
                .HasFilter("([UserId] IS NOT NULL)");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.User).WithMany(p => p.UserActivityLogs)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_ActivityLogs_Users");
        });

        modelBuilder.Entity<UserFavoriteSong>(entity =>
        {
            entity.HasKey(e => e.FavoriteId).HasName("PK__UserFavo__CE74FAD530AD47E2");

            entity.ToTable(tb => tb.HasTrigger("TR_FavoriteSongs_UpdateLikeCount"));

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Song).WithMany(p => p.UserFavoriteSongs).HasConstraintName("FK_FavSongs_Songs");

            entity.HasOne(d => d.User).WithMany(p => p.UserFavoriteSongs).HasConstraintName("FK_FavSongs_Users");
        });

        modelBuilder.Entity<UserFollowedArtist>(entity =>
        {
            entity.HasKey(e => e.FollowId).HasName("PK__UserFoll__2CE810AE3CE39D88");

            entity.ToTable(tb => tb.HasTrigger("TR_FollowedArtists_UpdateFollowerCount"));

            entity.Property(e => e.FollowedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Artist).WithMany(p => p.UserFollowedArtists).HasConstraintName("FK_FollowArtist_Artists");

            entity.HasOne(d => d.User).WithMany(p => p.UserFollowedArtists).HasConstraintName("FK_FollowArtist_Users");
        });

        modelBuilder.Entity<UserFollowedPlaylist>(entity =>
        {
            entity.HasKey(e => e.FollowId).HasName("PK__UserFoll__2CE810AEDC63FCEA");

            entity.ToTable(tb => tb.HasTrigger("TR_FollowedPlaylists_UpdateFollowerCount"));

            entity.Property(e => e.FollowedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Playlist).WithMany(p => p.UserFollowedPlaylists)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FollowPlaylist_Playlists");

            entity.HasOne(d => d.User).WithMany(p => p.UserFollowedPlaylists).HasConstraintName("FK_FollowPlaylist_Users");
        });

        modelBuilder.Entity<UserListeningHistory>(entity =>
        {
            entity.HasKey(e => e.HistoryId).HasName("PK__UserList__4D7B4ABDC0896785");

            entity.ToTable("UserListeningHistory", tb => tb.HasTrigger("TR_ListeningHistory_UpdatePlayCount"));

            entity.Property(e => e.IsCompleted).HasDefaultValue(false);
            entity.Property(e => e.ListenedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Song).WithMany(p => p.UserListeningHistories).HasConstraintName("FK_History_Songs");

            entity.HasOne(d => d.User).WithMany(p => p.UserListeningHistories).HasConstraintName("FK_History_Users");
        });

        modelBuilder.Entity<UserSubscriptionHistory>(entity =>
        {
            entity.HasKey(e => e.SubscriptionHistoryId).HasName("PK__UserSubs__B41AA99F2841FC38");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Status).HasDefaultValue("active");

            entity.HasOne(d => d.Plan).WithMany(p => p.UserSubscriptionHistories)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SubHistory_Plans");

            entity.HasOne(d => d.User).WithMany(p => p.UserSubscriptionHistories).HasConstraintName("FK_SubHistory_Users");
        });

        modelBuilder.Entity<VwActiveUser>(entity =>
        {
            entity.ToView("vw_ActiveUsers");

            entity.Property(e => e.UserId).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<VwAlbumDetail>(entity =>
        {
            entity.ToView("vw_AlbumDetails");
        });

        modelBuilder.Entity<VwPopularPlaylist>(entity =>
        {
            entity.ToView("vw_PopularPlaylists");
        });

        modelBuilder.Entity<VwPremiumUsersStat>(entity =>
        {
            entity.ToView("vw_PremiumUsersStats");
        });

        modelBuilder.Entity<VwRevenueSummary>(entity =>
        {
            entity.ToView("vw_RevenueSummary");
        });

        modelBuilder.Entity<VwSongsByGenre>(entity =>
        {
            entity.ToView("vw_SongsByGenre");
        });

        modelBuilder.Entity<VwTop100Song>(entity =>
        {
            entity.ToView("vw_Top100Songs");
        });

        modelBuilder.Entity<VwTopArtistsByPlay>(entity =>
        {
            entity.ToView("vw_TopArtistsByPlays");
        });

        modelBuilder.Entity<VwTrendingSong>(entity =>
        {
            entity.ToView("vw_TrendingSongs");
        });

        modelBuilder.Entity<VwUserListeningSummary>(entity =>
        {
            entity.ToView("vw_UserListeningSummary");
        });

        modelBuilder.Entity<VwUserSubscriptionSummary>(entity =>
        {
            entity.ToView("vw_UserSubscriptionSummary");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
