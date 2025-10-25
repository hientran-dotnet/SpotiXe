-- ============================================
-- SpotiXe - CREATE STORED PROCEDURES
-- ============================================

USE SpotiXe;
GO

PRINT 'Creating stored procedures...';
GO

-- ============================================
-- SP: Search Songs
-- ============================================

GO
CREATE PROCEDURE sp_SearchSongs
    @SearchTerm NVARCHAR(255),
    @Genre NVARCHAR(100) = NULL,
    @ArtistId BIGINT = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 20
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT 
        s.SongId,
        s.Title,
        s.Duration,
        s.PlayCount,
        s.LikeCount,
        s.Genre,
        s.CoverImageUrl,
        s.AudioFileUrl,
        s.StreamingUrl,
        a.ArtistId,
        a.Name AS ArtistName,
        a.ProfileImageUrl AS ArtistImage,
        al.AlbumId,
        al.Title AS AlbumTitle,
        COUNT(*) OVER() AS TotalRecords
    FROM Songs s
    INNER JOIN Artists a ON s.ArtistId = a.ArtistId
    LEFT JOIN Albums al ON s.AlbumId = al.AlbumId
    WHERE s.IsPublic = 1 
        AND s.IsActive = 1 
        AND s.DeletedAt IS NULL
        AND (@SearchTerm IS NULL OR s.Title LIKE '%' + @SearchTerm + '%' OR a.Name LIKE '%' + @SearchTerm + '%')
        AND (@Genre IS NULL OR s.Genre = @Genre)
        AND (@ArtistId IS NULL OR s.ArtistId = @ArtistId)
    ORDER BY s.PlayCount DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO

PRINT 'Procedure sp_SearchSongs created.';
GO

-- ============================================
-- SP: Get User Recommendations (Based on listening history)
-- ============================================

GO
CREATE PROCEDURE sp_GetUserRecommendations
    @UserId BIGINT,
    @Limit INT = 20
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get user's favorite genres
    WITH UserGenres AS (
        SELECT TOP 3 s.Genre, COUNT(*) AS GenreCount
        FROM UserListeningHistory ulh
        INNER JOIN Songs s ON ulh.SongId = s.SongId
        WHERE ulh.UserId = @UserId
        GROUP BY s.Genre
        ORDER BY COUNT(*) DESC
    ),
    -- Get artists user follows
    UserArtists AS (
        SELECT ArtistId FROM UserFollowedArtists WHERE UserId = @UserId
    ),
    -- Songs user already listened to
    UserListenedSongs AS (
        SELECT DISTINCT SongId FROM UserListeningHistory WHERE UserId = @UserId
    )
    
    -- Recommend songs
    SELECT TOP (@Limit)
        s.SongId,
        s.Title,
        s.Duration,
        s.PlayCount,
        s.Genre,
        s.CoverImageUrl,
        s.StreamingUrl,
        a.ArtistId,
        a.Name AS ArtistName,
        a.ProfileImageUrl AS ArtistImage,
        CASE 
            WHEN EXISTS (SELECT 1 FROM UserArtists ua WHERE ua.ArtistId = s.ArtistId) THEN 3
            WHEN EXISTS (SELECT 1 FROM UserGenres ug WHERE ug.Genre = s.Genre) THEN 2
            ELSE 1
        END AS RecommendationScore
    FROM Songs s
    INNER JOIN Artists a ON s.ArtistId = a.ArtistId
    WHERE s.IsPublic = 1 
        AND s.IsActive = 1 
        AND s.DeletedAt IS NULL
        AND NOT EXISTS (SELECT 1 FROM UserListenedSongs uls WHERE uls.SongId = s.SongId)
        AND (
            EXISTS (SELECT 1 FROM UserArtists ua WHERE ua.ArtistId = s.ArtistId)
            OR EXISTS (SELECT 1 FROM UserGenres ug WHERE ug.Genre = s.Genre)
        )
    ORDER BY RecommendationScore DESC, s.PlayCount DESC;
END;
GO

PRINT 'Procedure sp_GetUserRecommendations created.';
GO

-- ============================================
-- SP: Create Playlist with Songs
-- ============================================

GO
CREATE PROCEDURE sp_CreatePlaylist
    @UserId BIGINT,
    @PlaylistName NVARCHAR(255),
    @Description NVARCHAR(MAX) = NULL,
    @IsPublic BIT = 0,
    @SongIds NVARCHAR(MAX) = NULL, -- Comma-separated song IDs
    @PlaylistId BIGINT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Create playlist
        INSERT INTO Playlists (Name, Description, UserId, IsPublic)
        VALUES (@PlaylistName, @Description, @UserId, @IsPublic);
        
        SET @PlaylistId = SCOPE_IDENTITY();
        
        -- Add songs if provided
        IF @SongIds IS NOT NULL
        BEGIN
            DECLARE @Position INT = 1;
            DECLARE @SongId BIGINT;
            DECLARE @Pos INT = 1;
            DECLARE @NextPos INT;
            
            WHILE @Pos <= LEN(@SongIds)
            BEGIN
                SET @NextPos = CHARINDEX(',', @SongIds, @Pos);
                IF @NextPos = 0 SET @NextPos = LEN(@SongIds) + 1;
                
                SET @SongId = CAST(SUBSTRING(@SongIds, @Pos, @NextPos - @Pos) AS BIGINT);
                
                INSERT INTO PlaylistSongs (PlaylistId, SongId, Position, AddedBy)
                VALUES (@PlaylistId, @SongId, @Position, @UserId);
                
                SET @Position = @Position + 1;
                SET @Pos = @NextPos + 1;
            END;
        END;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO

PRINT 'Procedure sp_CreatePlaylist created.';
GO

-- ============================================
-- SP: Add Song to Playlist
-- ============================================

GO
CREATE PROCEDURE sp_AddSongToPlaylist
    @PlaylistId BIGINT,
    @SongId BIGINT,
    @UserId BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Check if user owns playlist or can add to it
        IF NOT EXISTS (SELECT 1 FROM Playlists WHERE PlaylistId = @PlaylistId AND UserId = @UserId)
        BEGIN
            RAISERROR('User does not own this playlist', 16, 1);
            RETURN;
        END;
        
        -- Get next position
        DECLARE @NextPosition INT;
        SELECT @NextPosition = ISNULL(MAX(Position), 0) + 1
        FROM PlaylistSongs
        WHERE PlaylistId = @PlaylistId;
        
        -- Add song
        INSERT INTO PlaylistSongs (PlaylistId, SongId, Position, AddedBy)
        VALUES (@PlaylistId, @SongId, @NextPosition, @UserId);
        
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO

PRINT 'Procedure sp_AddSongToPlaylist created.';
GO

-- ============================================
-- SP: Record Song Play (with streaming session)
-- ============================================

GO
CREATE PROCEDURE sp_RecordSongPlay
    @UserId BIGINT,
    @SongId BIGINT,
    @DeviceSessionId BIGINT,
    @DurationListened INT,
    @StreamingQuality NVARCHAR(20) = 'medium'
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @SongDuration INT;
        DECLARE @IsCompleted BIT = 0;
        
        -- Get song duration
        SELECT @SongDuration = Duration FROM Songs WHERE SongId = @SongId;
        
        -- Check if song was completed (listened to at least 80%)
        IF @DurationListened >= (@SongDuration * 0.8)
            SET @IsCompleted = 1;
        
        -- Get device info
        DECLARE @DeviceType NVARCHAR(50), @DeviceInfo NVARCHAR(255), @IPAddress NVARCHAR(45);
        SELECT @DeviceType = DeviceType, @DeviceInfo = DeviceInfo, @IPAddress = IPAddress
        FROM DeviceSessions
        WHERE SessionId = @DeviceSessionId;
        
        -- Record listening history
        INSERT INTO UserListeningHistory (UserId, SongId, DurationListened, DeviceType, DeviceInfo, IPAddress, IsCompleted)
        VALUES (@UserId, @SongId, @DurationListened, @DeviceType, @DeviceInfo, @IPAddress, @IsCompleted);
        
        -- Create streaming session record
        DECLARE @SessionToken NVARCHAR(255) = NEWID();
        INSERT INTO StreamingSessions (UserId, SongId, DeviceSessionId, SessionToken, StreamingQuality, BytesStreamed, EndTime)
        VALUES (@UserId, @SongId, @DeviceSessionId, @SessionToken, @StreamingQuality, 0, GETDATE());
        
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO

PRINT 'Procedure sp_RecordSongPlay created.';
GO

-- ============================================
-- SP: Get User Listening History
-- ============================================

GO
CREATE PROCEDURE sp_GetUserListeningHistory
    @UserId BIGINT,
    @Days INT = 30,
    @PageNumber INT = 1,
    @PageSize INT = 50
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    DECLARE @StartDate DATETIME2 = DATEADD(DAY, -@Days, GETDATE());
    
    SELECT 
        ulh.HistoryId,
        ulh.ListenedAt,
        ulh.DurationListened,
        ulh.DeviceType,
        ulh.IsCompleted,
        s.SongId,
        s.Title,
        s.Duration,
        s.CoverImageUrl,
        a.ArtistId,
        a.Name AS ArtistName,
        COUNT(*) OVER() AS TotalRecords
    FROM UserListeningHistory ulh
    INNER JOIN Songs s ON ulh.SongId = s.SongId
    INNER JOIN Artists a ON s.ArtistId = a.ArtistId
    WHERE ulh.UserId = @UserId
        AND ulh.ListenedAt >= @StartDate
    ORDER BY ulh.ListenedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO

PRINT 'Procedure sp_GetUserListeningHistory created.';
GO

-- ============================================
-- SP: Generate Daily Stats
-- ============================================

GO
CREATE PROCEDURE sp_GenerateDailyStats
    @Date DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @Date IS NULL
        SET @Date = CAST(GETDATE() AS DATE);
    
    -- Delete existing stats for this date
    DELETE FROM DailyStats WHERE Date = @Date;
    
    -- Insert new stats
    INSERT INTO DailyStats (Date, TotalUsers, TotalActiveUsers, TotalPlays, TotalNewUsers, TotalPremiumUsers, Revenue)
    SELECT 
        @Date AS Date,
        (SELECT COUNT(*) FROM Users WHERE IsActive = 1 AND DeletedAt IS NULL) AS TotalUsers,
        (SELECT COUNT(DISTINCT UserId) FROM UserListeningHistory WHERE CAST(ListenedAt AS DATE) = @Date) AS TotalActiveUsers,
        (SELECT COUNT(*) FROM UserListeningHistory WHERE CAST(ListenedAt AS DATE) = @Date) AS TotalPlays,
        (SELECT COUNT(*) FROM Users WHERE CAST(CreatedAt AS DATE) = @Date) AS TotalNewUsers,
        -- ✅ FIXED: Use SubscriptionEndDate instead of IsSubscriptionActive
        (SELECT COUNT(*) FROM Users WHERE SubscriptionEndDate > GETDATE() AND DeletedAt IS NULL) AS TotalPremiumUsers,
        (SELECT ISNULL(SUM(Amount), 0) FROM PaymentTransactions WHERE CAST(PaymentDate AS DATE) = @Date AND TransactionStatus = 'completed') AS Revenue;
END;
GO

PRINT 'Procedure sp_GenerateDailyStats created.';
GO

-- ============================================
-- SP: Generate Song Stats
-- ============================================

GO
CREATE PROCEDURE sp_GenerateSongStats
    @Date DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @Date IS NULL
        SET @Date = CAST(GETDATE() AS DATE);
    
    -- Delete existing stats for this date
    DELETE FROM SongStats WHERE Date = @Date;
    
    -- Insert new stats
    INSERT INTO SongStats (SongId, Date, PlayCount, UniqueListeners, SkipCount, CompletionRate)
    SELECT 
        ulh.SongId,
        @Date AS Date,
        COUNT(*) AS PlayCount,
        COUNT(DISTINCT ulh.UserId) AS UniqueListeners,
        SUM(CASE WHEN ulh.IsCompleted = 0 THEN 1 ELSE 0 END) AS SkipCount,
        CAST(SUM(CASE WHEN ulh.IsCompleted = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS DECIMAL(5,2)) AS CompletionRate
    FROM UserListeningHistory ulh
    WHERE CAST(ulh.ListenedAt AS DATE) = @Date
    GROUP BY ulh.SongId;
END;
GO

PRINT 'Procedure sp_GenerateSongStats created.';
GO

-- ============================================
-- SP: Process Subscription Payment
-- ============================================

GO
CREATE PROCEDURE sp_ProcessSubscriptionPayment
    @UserId BIGINT,
    @PlanId BIGINT,
    @PaymentMethod NVARCHAR(50),
    @PaymentGatewayTransactionId NVARCHAR(255),
    @TransactionId BIGINT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @Amount DECIMAL(10,2);
        SELECT @Amount = Price FROM SubscriptionPlans WHERE PlanId = @PlanId;
        
        -- Create payment transaction
        INSERT INTO PaymentTransactions (UserId, PlanId, Amount, PaymentMethod, PaymentGatewayTransactionId, TransactionStatus)
        VALUES (@UserId, @PlanId, @Amount, @PaymentMethod, @PaymentGatewayTransactionId, 'pending');
        
        SET @TransactionId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO

PRINT 'Procedure sp_ProcessSubscriptionPayment created.';
GO

-- ============================================
-- SP: Update Payment Status
-- ============================================

GO
CREATE PROCEDURE sp_UpdatePaymentStatus
    @TransactionId BIGINT,
    @NewStatus NVARCHAR(20),
    @PaymentGatewayResponse NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE PaymentTransactions
    SET TransactionStatus = @NewStatus,
        PaymentGatewayResponse = @PaymentGatewayResponse,
        UpdatedAt = GETDATE()
    WHERE TransactionId = @TransactionId;
END;
GO

PRINT 'Procedure sp_UpdatePaymentStatus created.';
GO

-- ============================================
-- SP: Get Playlist with Songs
-- ============================================

GO
CREATE PROCEDURE sp_GetPlaylistWithSongs
    @PlaylistId BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Playlist info
    SELECT 
        p.PlaylistId,
        p.Name,
        p.Description,
        p.CoverImageUrl,
        p.IsPublic,
        p.TotalSongs,
        p.TotalDuration,
        p.FollowerCount,
        p.PlaylistType,
        p.CreatedAt,
        u.UserId AS CreatorId,
        u.Username AS CreatorName,
        u.AvatarUrl AS CreatorAvatar
    FROM Playlists p
    INNER JOIN Users u ON p.UserId = u.UserId
    WHERE p.PlaylistId = @PlaylistId AND p.DeletedAt IS NULL;
    
    -- Playlist songs
    SELECT 
        ps.PlaylistSongId,
        ps.Position,
        ps.AddedAt,
        s.SongId,
        s.Title,
        s.Duration,
        s.CoverImageUrl,
        s.StreamingUrl,
        a.ArtistId,
        a.Name AS ArtistName,
        al.AlbumId,
        al.Title AS AlbumTitle
    FROM PlaylistSongs ps
    INNER JOIN Songs s ON ps.SongId = s.SongId
    INNER JOIN Artists a ON s.ArtistId = a.ArtistId
    LEFT JOIN Albums al ON s.AlbumId = al.AlbumId
    WHERE ps.PlaylistId = @PlaylistId
    ORDER BY ps.Position;
END;
GO

PRINT 'Procedure sp_GetPlaylistWithSongs created.';
GO

-- ============================================
-- SP: Clean Up Old Data
-- ============================================

GO
CREATE PROCEDURE sp_CleanUpOldData
    @DaysToKeepHistory INT = 365,
    @DaysToKeepLogs INT = 90,
    @DaysToKeepSessions INT = 7
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @CutoffHistory DATETIME2 = DATEADD(DAY, -@DaysToKeepHistory, GETDATE());
        DECLARE @CutoffLogs DATETIME2 = DATEADD(DAY, -@DaysToKeepLogs, GETDATE());
        DECLARE @CutoffSessions DATETIME2 = DATEADD(DAY, -@DaysToKeepSessions, GETDATE());
        
        -- Delete old listening history (for non-premium users)
        -- ✅ FIXED: Use SubscriptionEndDate instead of IsSubscriptionActive
        DELETE FROM UserListeningHistory
        WHERE ListenedAt < @CutoffHistory
            AND UserId NOT IN (SELECT UserId FROM Users WHERE SubscriptionEndDate > GETDATE());
        
        -- Delete old activity logs
        DELETE FROM UserActivityLogs WHERE CreatedAt < @CutoffLogs;
        
        -- Delete old error logs
        DELETE FROM ErrorLogs WHERE CreatedAt < @CutoffLogs;
        
        -- Delete old streaming sessions
        DELETE FROM StreamingSessions WHERE StartTime < @CutoffSessions;
        
        -- Delete inactive device sessions
        DELETE FROM DeviceSessions WHERE LastActivityAt < @CutoffSessions AND IsActive = 0;
        
        COMMIT TRANSACTION;
        
        PRINT 'Old data cleaned up successfully.';
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO

PRINT 'Procedure sp_CleanUpOldData created.';
GO

PRINT 'All stored procedures created successfully!';
GO
