-- ============================================
-- SpotiXe - CREATE TRIGGERS
-- ============================================

USE SpotiXe;
GO

PRINT 'Creating triggers...';
GO

-- ============================================
-- TRIGGER: Update UpdatedAt timestamp
-- ============================================

-- Artists
GO
CREATE TRIGGER TR_Artists_UpdatedAt
ON Artists
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Artists
    SET UpdatedAt = GETDATE()
    FROM Artists a
    INNER JOIN inserted i ON a.ArtistId = i.ArtistId;
END;
GO

-- Albums
GO
CREATE TRIGGER TR_Albums_UpdatedAt
ON Albums
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Albums
    SET UpdatedAt = GETDATE()
    FROM Albums a
    INNER JOIN inserted i ON a.AlbumId = i.AlbumId;
END;
GO

-- Songs
GO
CREATE TRIGGER TR_Songs_UpdatedAt
ON Songs
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Songs
    SET UpdatedAt = GETDATE()
    FROM Songs s
    INNER JOIN inserted i ON s.SongId = i.SongId;
END;
GO

-- Users
GO
CREATE TRIGGER TR_Users_UpdatedAt
ON Users
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Users
    SET UpdatedAt = GETDATE()
    FROM Users u
    INNER JOIN inserted i ON u.UserId = i.UserId;
END;
GO

-- Playlists
GO
CREATE TRIGGER TR_Playlists_UpdatedAt
ON Playlists
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Playlists
    SET UpdatedAt = GETDATE()
    FROM Playlists p
    INNER JOIN inserted i ON p.PlaylistId = i.PlaylistId;
END;
GO

-- SubscriptionPlans
GO
CREATE TRIGGER TR_SubscriptionPlans_UpdatedAt
ON SubscriptionPlans
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE SubscriptionPlans
    SET UpdatedAt = GETDATE()
    FROM SubscriptionPlans sp
    INNER JOIN inserted i ON sp.PlanId = i.PlanId;
END;
GO

-- PaymentTransactions
GO
CREATE TRIGGER TR_PaymentTransactions_UpdatedAt
ON PaymentTransactions
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE PaymentTransactions
    SET UpdatedAt = GETDATE()
    FROM PaymentTransactions pt
    INNER JOIN inserted i ON pt.TransactionId = i.TransactionId;
END;
GO

PRINT 'UpdatedAt triggers created.';
GO

-- ============================================
-- TRIGGER: Auto-update Album total tracks and duration
-- ============================================

GO
CREATE TRIGGER TR_Songs_UpdateAlbumStats
ON Songs
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get affected album IDs
    DECLARE @AffectedAlbums TABLE (AlbumId BIGINT);
    
    INSERT INTO @AffectedAlbums
    SELECT DISTINCT AlbumId FROM inserted WHERE AlbumId IS NOT NULL
    UNION
    SELECT DISTINCT AlbumId FROM deleted WHERE AlbumId IS NOT NULL;
    
    -- Update album statistics
    UPDATE Albums
    SET TotalTracks = (SELECT COUNT(*) FROM Songs WHERE AlbumId = a.AlbumId AND DeletedAt IS NULL),
        TotalDuration = (SELECT ISNULL(SUM(Duration), 0) FROM Songs WHERE AlbumId = a.AlbumId AND DeletedAt IS NULL)
    FROM Albums a
    INNER JOIN @AffectedAlbums aa ON a.AlbumId = aa.AlbumId;
END;
GO

PRINT 'Album stats trigger created.';
GO

-- ============================================
-- TRIGGER: Auto-update Playlist total songs and duration
-- ============================================

GO
CREATE TRIGGER TR_PlaylistSongs_UpdatePlaylistStats
ON PlaylistSongs
AFTER INSERT, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get affected playlist IDs
    DECLARE @AffectedPlaylists TABLE (PlaylistId BIGINT);
    
    INSERT INTO @AffectedPlaylists
    SELECT DISTINCT PlaylistId FROM inserted
    UNION
    SELECT DISTINCT PlaylistId FROM deleted;
    
    -- Update playlist statistics
    UPDATE Playlists
    SET TotalSongs = (SELECT COUNT(*) FROM PlaylistSongs WHERE PlaylistId = p.PlaylistId),
        TotalDuration = (
            SELECT ISNULL(SUM(s.Duration), 0)
            FROM PlaylistSongs ps
            INNER JOIN Songs s ON ps.SongId = s.SongId
            WHERE ps.PlaylistId = p.PlaylistId
        )
    FROM Playlists p
    INNER JOIN @AffectedPlaylists ap ON p.PlaylistId = ap.PlaylistId;
END;
GO

PRINT 'Playlist stats trigger created.';
GO

-- ============================================
-- TRIGGER: Auto-update Song play count and like count
-- ============================================

GO
CREATE TRIGGER TR_ListeningHistory_UpdatePlayCount
ON UserListeningHistory
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Songs
    SET PlayCount = PlayCount + 1
    FROM Songs s
    INNER JOIN inserted i ON s.SongId = i.SongId;
END;
GO

PRINT 'Play count trigger created.';
GO

GO
CREATE TRIGGER TR_FavoriteSongs_UpdateLikeCount
ON UserFavoriteSongs
AFTER INSERT, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get affected song IDs
    DECLARE @AffectedSongs TABLE (SongId BIGINT);
    
    INSERT INTO @AffectedSongs
    SELECT DISTINCT SongId FROM inserted
    UNION
    SELECT DISTINCT SongId FROM deleted;
    
    -- Update like count
    UPDATE Songs
    SET LikeCount = (SELECT COUNT(*) FROM UserFavoriteSongs WHERE SongId = s.SongId)
    FROM Songs s
    INNER JOIN @AffectedSongs a_s ON s.SongId = a_s.SongId;
END;
GO

PRINT 'Like count trigger created.';
GO

-- ============================================
-- TRIGGER: Auto-update Artist total followers
-- ============================================

GO
CREATE TRIGGER TR_FollowedArtists_UpdateFollowerCount
ON UserFollowedArtists
AFTER INSERT, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get affected artist IDs
    DECLARE @AffectedArtists TABLE (ArtistId BIGINT);
    
    INSERT INTO @AffectedArtists
    SELECT DISTINCT ArtistId FROM inserted
    UNION
    SELECT DISTINCT ArtistId FROM deleted;
    
    -- Update follower count
    UPDATE Artists
    SET TotalFollowers = (SELECT COUNT(*) FROM UserFollowedArtists WHERE ArtistId = a.ArtistId)
    FROM Artists a
    INNER JOIN @AffectedArtists aa ON a.ArtistId = aa.ArtistId;
END;
GO

PRINT 'Artist follower count trigger created.';
GO

-- ============================================
-- TRIGGER: Auto-update Playlist follower count
-- ============================================

GO
CREATE TRIGGER TR_FollowedPlaylists_UpdateFollowerCount
ON UserFollowedPlaylists
AFTER INSERT, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get affected playlist IDs
    DECLARE @AffectedPlaylists TABLE (PlaylistId BIGINT);
    
    INSERT INTO @AffectedPlaylists
    SELECT DISTINCT PlaylistId FROM inserted
    UNION
    SELECT DISTINCT PlaylistId FROM deleted;
    
    -- Update follower count
    UPDATE Playlists
    SET FollowerCount = (SELECT COUNT(*) FROM UserFollowedPlaylists WHERE PlaylistId = p.PlaylistId)
    FROM Playlists p
    INNER JOIN @AffectedPlaylists ap ON p.PlaylistId = ap.PlaylistId;
END;
GO

PRINT 'Playlist follower count trigger created.';
GO

-- ============================================
-- TRIGGER: Log user activity on login
-- ============================================

GO
CREATE TRIGGER TR_Users_LogLogin
ON Users
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Log login activity when LastLoginAt is updated
    INSERT INTO UserActivityLogs (UserId, ActivityType, ActivityDetails)
    SELECT 
        i.UserId,
        'login',
        JSON_QUERY('{"timestamp": "' + CONVERT(VARCHAR(30), i.LastLoginAt, 127) + '"}')
    FROM inserted i
    INNER JOIN deleted d ON i.UserId = d.UserId
    WHERE i.LastLoginAt != d.LastLoginAt OR (i.LastLoginAt IS NOT NULL AND d.LastLoginAt IS NULL);
END;
GO

PRINT 'User login log trigger created.';
GO

-- ============================================
-- TRIGGER: Update subscription status when payment completed
-- ============================================

GO
CREATE TRIGGER TR_Payment_UpdateSubscription
ON PaymentTransactions
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- When payment status changes to 'completed', update user subscription
    UPDATE Users
    SET CurrentPlanId = i.PlanId,
        SubscriptionStartDate = i.PaymentDate,
        SubscriptionEndDate = DATEADD(DAY, sp.DurationDays, i.PaymentDate)
    FROM Users u
    INNER JOIN inserted i ON u.UserId = i.UserId
    INNER JOIN deleted d ON i.TransactionId = d.TransactionId
    INNER JOIN SubscriptionPlans sp ON i.PlanId = sp.PlanId
    WHERE i.TransactionStatus = 'completed' AND d.TransactionStatus != 'completed';
    
    -- Insert subscription history record
    INSERT INTO UserSubscriptionHistory (UserId, PlanId, StartDate, EndDate, Status)
    SELECT 
        i.UserId,
        i.PlanId,
        i.PaymentDate,
        DATEADD(DAY, sp.DurationDays, i.PaymentDate),
        'active'
    FROM inserted i
    INNER JOIN deleted d ON i.TransactionId = d.TransactionId
    INNER JOIN SubscriptionPlans sp ON i.PlanId = sp.PlanId
    WHERE i.TransactionStatus = 'completed' AND d.TransactionStatus != 'completed';
END;
GO

PRINT 'Payment subscription trigger created.';
GO

PRINT 'All triggers created successfully!';
GO
