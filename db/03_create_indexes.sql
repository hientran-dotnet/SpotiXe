-- ============================================
-- SpotiXe - CREATE INDEXES
-- ============================================

USE SpotiXe;
GO

PRINT 'Creating indexes for performance optimization...';
GO

-- ============================================
-- ARTISTS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_Artists_Name ON Artists(Name);
CREATE NONCLUSTERED INDEX IX_Artists_Country ON Artists(Country);
CREATE NONCLUSTERED INDEX IX_Artists_IsActive ON Artists(IsActive) WHERE DeletedAt IS NULL;
CREATE NONCLUSTERED INDEX IX_Artists_TotalFollowers ON Artists(TotalFollowers DESC);
GO

PRINT 'Artists indexes created.';
GO

-- ============================================
-- ALBUMS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_Albums_ArtistId ON Albums(ArtistId);
CREATE NONCLUSTERED INDEX IX_Albums_ReleaseDate ON Albums(ReleaseDate DESC);
CREATE NONCLUSTERED INDEX IX_Albums_IsActive ON Albums(IsActive) WHERE DeletedAt IS NULL;
CREATE NONCLUSTERED INDEX IX_Albums_Title ON Albums(Title);
GO

PRINT 'Albums indexes created.';
GO

-- ============================================
-- SONGS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_Songs_Title ON Songs(Title);
CREATE NONCLUSTERED INDEX IX_Songs_ArtistId ON Songs(ArtistId);
CREATE NONCLUSTERED INDEX IX_Songs_AlbumId ON Songs(AlbumId) WHERE AlbumId IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_Songs_Genre ON Songs(Genre);
CREATE NONCLUSTERED INDEX IX_Songs_PlayCount ON Songs(PlayCount DESC);
CREATE NONCLUSTERED INDEX IX_Songs_LikeCount ON Songs(LikeCount DESC);
CREATE NONCLUSTERED INDEX IX_Songs_IsPublic ON Songs(IsPublic, IsActive) WHERE DeletedAt IS NULL;
CREATE NONCLUSTERED INDEX IX_Songs_ReleaseDate ON Songs(ReleaseDate DESC);

-- Composite indexes for common queries
CREATE NONCLUSTERED INDEX IX_Songs_Artist_Genre ON Songs(ArtistId, Genre);
CREATE NONCLUSTERED INDEX IX_Songs_Album_Genre ON Songs(AlbumId, Genre) WHERE AlbumId IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_Songs_Genre_PlayCount ON Songs(Genre, PlayCount DESC);
GO

-- Full-text search for Songs
-- Note: Full-text index requires a unique single-column primary key
-- We'll use the auto-generated PK constraint name
IF NOT EXISTS (SELECT * FROM sys.fulltext_catalogs WHERE name = 'SongsCatalog')
BEGIN
    CREATE FULLTEXT CATALOG SongsCatalog AS DEFAULT;
END
GO

-- Get the actual PK name dynamically and create full-text index
DECLARE @PKName NVARCHAR(128);
SELECT @PKName = i.name 
FROM sys.indexes i
INNER JOIN sys.tables t ON i.object_id = t.object_id
WHERE t.name = 'Songs' AND i.is_primary_key = 1;

IF @PKName IS NOT NULL
BEGIN
    DECLARE @SQL NVARCHAR(MAX);
    SET @SQL = 'CREATE FULLTEXT INDEX ON Songs(Title, Lyrics) KEY INDEX ' + @PKName + ' WITH STOPLIST = SYSTEM;';
    EXEC sp_executesql @SQL;
    PRINT 'Full-text index created on Songs table.';
END
ELSE
BEGIN
    PRINT 'Warning: Could not find Primary Key for Songs table. Full-text index not created.';
END
GO

PRINT 'Songs indexes created.';
GO

-- ============================================
-- SUBSCRIPTION PLANS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_Plans_IsActive ON SubscriptionPlans(IsActive);
CREATE NONCLUSTERED INDEX IX_Plans_Price ON SubscriptionPlans(Price);
CREATE NONCLUSTERED INDEX IX_Plans_Name ON SubscriptionPlans(Name);
GO

PRINT 'SubscriptionPlans indexes created.';
GO

-- ============================================
-- USERS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_Users_Email ON Users(Email);
CREATE NONCLUSTERED INDEX IX_Users_Username ON Users(Username);
CREATE NONCLUSTERED INDEX IX_Users_CurrentPlanId ON Users(CurrentPlanId) WHERE CurrentPlanId IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_Users_IsActive ON Users(IsActive) WHERE DeletedAt IS NULL;
-- ✅ FIXED: Removed IsSubscriptionActive column (doesn't exist, using function instead)
CREATE NONCLUSTERED INDEX IX_Users_SubscriptionEndDate ON Users(SubscriptionEndDate DESC) WHERE SubscriptionEndDate IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_Users_Country ON Users(Country);
CREATE NONCLUSTERED INDEX IX_Users_CreatedAt ON Users(CreatedAt DESC);
CREATE NONCLUSTERED INDEX IX_Users_LastLoginAt ON Users(LastLoginAt DESC) WHERE LastLoginAt IS NOT NULL;
GO

PRINT 'Users indexes created.';
GO

-- ============================================
-- USER LISTENING HISTORY INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_History_UserId ON UserListeningHistory(UserId);
CREATE NONCLUSTERED INDEX IX_History_SongId ON UserListeningHistory(SongId);
CREATE NONCLUSTERED INDEX IX_History_ListenedAt ON UserListeningHistory(ListenedAt DESC);
CREATE NONCLUSTERED INDEX IX_History_User_Date ON UserListeningHistory(UserId, ListenedAt DESC);
CREATE NONCLUSTERED INDEX IX_History_Song_Date ON UserListeningHistory(SongId, ListenedAt DESC);
CREATE NONCLUSTERED INDEX IX_History_DeviceType ON UserListeningHistory(DeviceType);
CREATE NONCLUSTERED INDEX IX_History_IsCompleted ON UserListeningHistory(IsCompleted);
GO

PRINT 'UserListeningHistory indexes created.';
GO

-- ============================================
-- USER FAVORITE SONGS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_FavSongs_UserId ON UserFavoriteSongs(UserId);
CREATE NONCLUSTERED INDEX IX_FavSongs_SongId ON UserFavoriteSongs(SongId);
CREATE NONCLUSTERED INDEX IX_FavSongs_CreatedAt ON UserFavoriteSongs(CreatedAt DESC);
GO

PRINT 'UserFavoriteSongs indexes created.';
GO

-- ============================================
-- USER FOLLOWED ARTISTS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_FollowArtist_UserId ON UserFollowedArtists(UserId);
CREATE NONCLUSTERED INDEX IX_FollowArtist_ArtistId ON UserFollowedArtists(ArtistId);
CREATE NONCLUSTERED INDEX IX_FollowArtist_FollowedAt ON UserFollowedArtists(FollowedAt DESC);
GO

PRINT 'UserFollowedArtists indexes created.';
GO

-- ============================================
-- PLAYLISTS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_Playlists_UserId ON Playlists(UserId);
CREATE NONCLUSTERED INDEX IX_Playlists_IsPublic ON Playlists(IsPublic) WHERE DeletedAt IS NULL;
CREATE NONCLUSTERED INDEX IX_Playlists_Name ON Playlists(Name);
CREATE NONCLUSTERED INDEX IX_Playlists_PlaylistType ON Playlists(PlaylistType);
CREATE NONCLUSTERED INDEX IX_Playlists_FollowerCount ON Playlists(FollowerCount DESC) WHERE IsPublic = 1;
CREATE NONCLUSTERED INDEX IX_Playlists_CreatedAt ON Playlists(CreatedAt DESC);
GO

PRINT 'Playlists indexes created.';
GO

-- ============================================
-- PLAYLIST SONGS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_PlaylistSongs_PlaylistId ON PlaylistSongs(PlaylistId, Position);
CREATE NONCLUSTERED INDEX IX_PlaylistSongs_SongId ON PlaylistSongs(SongId);
CREATE NONCLUSTERED INDEX IX_PlaylistSongs_AddedBy ON PlaylistSongs(AddedBy) WHERE AddedBy IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_PlaylistSongs_AddedAt ON PlaylistSongs(AddedAt DESC);
GO

PRINT 'PlaylistSongs indexes created.';
GO

-- ============================================
-- USER FOLLOWED PLAYLISTS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_FollowPlaylist_UserId ON UserFollowedPlaylists(UserId);
CREATE NONCLUSTERED INDEX IX_FollowPlaylist_PlaylistId ON UserFollowedPlaylists(PlaylistId);
CREATE NONCLUSTERED INDEX IX_FollowPlaylist_FollowedAt ON UserFollowedPlaylists(FollowedAt DESC);
GO

PRINT 'UserFollowedPlaylists indexes created.';
GO

-- ============================================
-- SUBSCRIPTION HISTORY INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_SubHistory_UserId ON UserSubscriptionHistory(UserId);
CREATE NONCLUSTERED INDEX IX_SubHistory_PlanId ON UserSubscriptionHistory(PlanId);
CREATE NONCLUSTERED INDEX IX_SubHistory_Status ON UserSubscriptionHistory(Status);
CREATE NONCLUSTERED INDEX IX_SubHistory_EndDate ON UserSubscriptionHistory(EndDate DESC);
CREATE NONCLUSTERED INDEX IX_SubHistory_User_Status ON UserSubscriptionHistory(UserId, Status, EndDate DESC);
GO

PRINT 'UserSubscriptionHistory indexes created.';
GO

-- ============================================
-- PAYMENT TRANSACTIONS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_Payment_UserId ON PaymentTransactions(UserId);
CREATE NONCLUSTERED INDEX IX_Payment_PlanId ON PaymentTransactions(PlanId);
CREATE NONCLUSTERED INDEX IX_Payment_Status ON PaymentTransactions(TransactionStatus);
CREATE NONCLUSTERED INDEX IX_Payment_PaymentDate ON PaymentTransactions(PaymentDate DESC);
CREATE NONCLUSTERED INDEX IX_Payment_User_Status ON PaymentTransactions(UserId, TransactionStatus, PaymentDate DESC);
CREATE NONCLUSTERED INDEX IX_Payment_GatewayTxId ON PaymentTransactions(PaymentGatewayTransactionId) WHERE PaymentGatewayTransactionId IS NOT NULL;
GO

PRINT 'PaymentTransactions indexes created.';
GO

-- ============================================
-- DEVICE SESSIONS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_DeviceSession_UserId ON DeviceSessions(UserId);
CREATE NONCLUSTERED INDEX IX_DeviceSession_DeviceToken ON DeviceSessions(DeviceToken);
CREATE NONCLUSTERED INDEX IX_DeviceSession_IsActive ON DeviceSessions(IsActive);
CREATE NONCLUSTERED INDEX IX_DeviceSession_LastActivity ON DeviceSessions(LastActivityAt DESC);
GO

PRINT 'DeviceSessions indexes created.';
GO

-- ============================================
-- STREAMING SESSIONS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_Streaming_UserId ON StreamingSessions(UserId);
CREATE NONCLUSTERED INDEX IX_Streaming_SongId ON StreamingSessions(SongId);
CREATE NONCLUSTERED INDEX IX_Streaming_DeviceSessionId ON StreamingSessions(DeviceSessionId);
CREATE NONCLUSTERED INDEX IX_Streaming_SessionToken ON StreamingSessions(SessionToken);
CREATE NONCLUSTERED INDEX IX_Streaming_StartTime ON StreamingSessions(StartTime DESC);
CREATE NONCLUSTERED INDEX IX_Streaming_Quality ON StreamingSessions(StreamingQuality);
GO

PRINT 'StreamingSessions indexes created.';
GO

-- ============================================
-- DAILY STATS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_DailyStats_Date ON DailyStats(Date DESC);
GO

PRINT 'DailyStats indexes created.';
GO

-- ============================================
-- SONG STATS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_SongStats_SongId ON SongStats(SongId, Date DESC);
CREATE NONCLUSTERED INDEX IX_SongStats_Date ON SongStats(Date DESC);
CREATE NONCLUSTERED INDEX IX_SongStats_PlayCount ON SongStats(PlayCount DESC);
GO

PRINT 'SongStats indexes created.';
GO

-- ============================================
-- ACTIVITY LOGS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_ActivityLogs_UserId ON UserActivityLogs(UserId) WHERE UserId IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_ActivityLogs_ActivityType ON UserActivityLogs(ActivityType);
CREATE NONCLUSTERED INDEX IX_ActivityLogs_CreatedAt ON UserActivityLogs(CreatedAt DESC);
CREATE NONCLUSTERED INDEX IX_ActivityLogs_User_Type_Date ON UserActivityLogs(UserId, ActivityType, CreatedAt DESC) WHERE UserId IS NOT NULL;
GO

PRINT 'UserActivityLogs indexes created.';
GO

-- ============================================
-- ERROR LOGS INDEXES
-- ============================================

CREATE NONCLUSTERED INDEX IX_ErrorLogs_ErrorType ON ErrorLogs(ErrorType);
CREATE NONCLUSTERED INDEX IX_ErrorLogs_UserId ON ErrorLogs(UserId) WHERE UserId IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_ErrorLogs_CreatedAt ON ErrorLogs(CreatedAt DESC);
GO

PRINT 'ErrorLogs indexes created.';
GO

PRINT 'All indexes created successfully!';
GO
