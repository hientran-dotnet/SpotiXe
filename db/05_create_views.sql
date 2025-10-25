-- ============================================
-- SpotiXe - CREATE VIEWS
-- ============================================

USE SpotiXe;
GO

PRINT 'Creating views...';
GO

-- ============================================
-- VIEW: Top 100 Songs by Play Count
-- ============================================

GO
CREATE VIEW vw_Top100Songs
AS
SELECT TOP 100
    s.SongId,
    s.Title,
    s.Duration,
    s.PlayCount,
    s.LikeCount,
    s.Genre,
    s.CoverImageUrl,
    s.ReleaseDate,
    a.ArtistId,
    a.Name AS ArtistName,
    a.ProfileImageUrl AS ArtistImage,
    al.AlbumId,
    al.Title AS AlbumTitle,
    al.CoverImageUrl AS AlbumCoverImage
FROM Songs s
INNER JOIN Artists a ON s.ArtistId = a.ArtistId
LEFT JOIN Albums al ON s.AlbumId = al.AlbumId
WHERE s.IsPublic = 1 AND s.IsActive = 1 AND s.DeletedAt IS NULL
ORDER BY s.PlayCount DESC;
GO

PRINT 'View vw_Top100Songs created.';
GO

-- ============================================
-- VIEW: Trending Songs (Last 7 days)
-- ============================================

GO
CREATE VIEW vw_TrendingSongs
AS
SELECT TOP 50
    s.SongId,
    s.Title,
    s.Duration,
    s.Genre,
    s.CoverImageUrl,
    a.ArtistId,
    a.Name AS ArtistName,
    SUM(ss.PlayCount) AS RecentPlayCount,
    SUM(ss.UniqueListeners) AS RecentUniqueListeners
FROM Songs s
INNER JOIN Artists a ON s.ArtistId = a.ArtistId
INNER JOIN SongStats ss ON s.SongId = ss.SongId
WHERE ss.Date >= DATEADD(DAY, -7, GETDATE())
    AND s.IsPublic = 1 
    AND s.IsActive = 1 
    AND s.DeletedAt IS NULL
GROUP BY s.SongId, s.Title, s.Duration, s.Genre, s.CoverImageUrl, a.ArtistId, a.Name
ORDER BY SUM(ss.PlayCount) DESC;
GO

PRINT 'View vw_TrendingSongs created.';
GO

-- ============================================
-- VIEW: Premium Users Statistics
-- ============================================

GO
CREATE VIEW vw_PremiumUsersStats
AS
SELECT 
    u.UserId,
    u.Username,
    u.Email,
    u.FullName,
    sp.Name AS SubscriptionPlan,
    sp.Price AS PlanPrice,
    u.SubscriptionStartDate,
    u.SubscriptionEndDate,
    DATEDIFF(DAY, GETDATE(), u.SubscriptionEndDate) AS DaysRemaining,
    CASE 
        WHEN u.SubscriptionEndDate > GETDATE() THEN 'Active'
        WHEN u.SubscriptionEndDate <= GETDATE() THEN 'Expired'
        ELSE 'No Subscription'
    END AS SubscriptionStatus
FROM Users u
INNER JOIN SubscriptionPlans sp ON u.CurrentPlanId = sp.PlanId
WHERE u.IsActive = 1 AND u.DeletedAt IS NULL;
GO

PRINT 'View vw_PremiumUsersStats created.';
GO

-- ============================================
-- VIEW: Top Artists by Total Plays
-- ============================================

GO
CREATE VIEW vw_TopArtistsByPlays
AS
SELECT TOP 50
    a.ArtistId,
    a.Name,
    a.Country,
    a.ProfileImageUrl,
    a.TotalFollowers,
    COUNT(s.SongId) AS TotalSongs,
    SUM(s.PlayCount) AS TotalPlays,
    SUM(s.LikeCount) AS TotalLikes
FROM Artists a
INNER JOIN Songs s ON a.ArtistId = s.ArtistId
WHERE a.IsActive = 1 AND a.DeletedAt IS NULL
    AND s.IsActive = 1 AND s.DeletedAt IS NULL
GROUP BY a.ArtistId, a.Name, a.Country, a.ProfileImageUrl, a.TotalFollowers
ORDER BY SUM(s.PlayCount) DESC;
GO

PRINT 'View vw_TopArtistsByPlays created.';
GO

-- ============================================
-- VIEW: Popular Playlists
-- ============================================

GO
CREATE VIEW vw_PopularPlaylists
AS
SELECT TOP 100
    p.PlaylistId,
    p.Name,
    p.Description,
    p.CoverImageUrl,
    p.TotalSongs,
    p.TotalDuration,
    p.FollowerCount,
    p.PlaylistType,
    u.UserId AS CreatorId,
    u.Username AS CreatorName,
    u.AvatarUrl AS CreatorAvatar,
    p.CreatedAt,
    p.UpdatedAt
FROM Playlists p
INNER JOIN Users u ON p.UserId = u.UserId
WHERE p.IsPublic = 1 
    AND p.IsActive = 1 
    AND p.DeletedAt IS NULL
    AND u.IsActive = 1 
    AND u.DeletedAt IS NULL
ORDER BY p.FollowerCount DESC, p.CreatedAt DESC;
GO

PRINT 'View vw_PopularPlaylists created.';
GO

-- ============================================
-- VIEW: Active Users (Logged in last 30 days)
-- ============================================

GO
CREATE VIEW vw_ActiveUsers
AS
SELECT 
    u.UserId,
    u.Username,
    u.Email,
    u.FullName,
    u.Country,
    u.LastLoginAt,
    CASE 
        WHEN u.CurrentPlanId IS NOT NULL AND u.SubscriptionEndDate > GETDATE() THEN 'Premium'
        ELSE 'Free'
    END AS UserType,
    (SELECT COUNT(*) FROM UserListeningHistory WHERE UserId = u.UserId AND ListenedAt >= DATEADD(DAY, -30, GETDATE())) AS ListensLast30Days,
    (SELECT COUNT(*) FROM UserFavoriteSongs WHERE UserId = u.UserId) AS TotalFavorites,
    (SELECT COUNT(*) FROM Playlists WHERE UserId = u.UserId AND DeletedAt IS NULL) AS TotalPlaylists
FROM Users u
WHERE u.LastLoginAt >= DATEADD(DAY, -30, GETDATE())
    AND u.IsActive = 1 
    AND u.DeletedAt IS NULL;
GO

PRINT 'View vw_ActiveUsers created.';
GO

-- ============================================
-- VIEW: Songs by Genre Statistics
-- ============================================

GO
CREATE VIEW vw_SongsByGenre
AS
SELECT 
    s.Genre,
    COUNT(s.SongId) AS TotalSongs,
    SUM(s.PlayCount) AS TotalPlays,
    SUM(s.LikeCount) AS TotalLikes,
    AVG(s.Duration) AS AvgDuration,
    COUNT(DISTINCT s.ArtistId) AS TotalArtists
FROM Songs s
WHERE s.IsActive = 1 
    AND s.DeletedAt IS NULL 
    AND s.Genre IS NOT NULL
GROUP BY s.Genre;
GO

PRINT 'View vw_SongsByGenre created.';
GO

-- ============================================
-- VIEW: Revenue Summary
-- ============================================

GO
CREATE VIEW vw_RevenueSummary
AS
SELECT 
    YEAR(pt.PaymentDate) AS Year,
    MONTH(pt.PaymentDate) AS Month,
    DATENAME(MONTH, pt.PaymentDate) AS MonthName,
    COUNT(DISTINCT pt.UserId) AS TotalPayingUsers,
    COUNT(pt.TransactionId) AS TotalTransactions,
    SUM(CASE WHEN pt.TransactionStatus = 'completed' THEN pt.Amount ELSE 0 END) AS TotalRevenue,
    SUM(CASE WHEN pt.TransactionStatus = 'refunded' THEN pt.Amount ELSE 0 END) AS TotalRefunds,
    SUM(CASE WHEN pt.TransactionStatus = 'failed' THEN 1 ELSE 0 END) AS FailedTransactions
FROM PaymentTransactions pt
WHERE pt.PaymentDate >= DATEADD(YEAR, -2, GETDATE())
GROUP BY YEAR(pt.PaymentDate), MONTH(pt.PaymentDate), DATENAME(MONTH, pt.PaymentDate);
GO

PRINT 'View vw_RevenueSummary created.';
GO

-- ============================================
-- VIEW: User Listening Summary
-- ============================================

GO
CREATE VIEW vw_UserListeningSummary
AS
SELECT 
    u.UserId,
    u.Username,
    u.Email,
    COUNT(DISTINCT ulh.SongId) AS UniqueSongsPlayed,
    COUNT(ulh.HistoryId) AS TotalListens,
    SUM(ulh.DurationListened) / 60 AS TotalMinutesListened,
    COUNT(DISTINCT ulh.DeviceType) AS DeviceTypesUsed,
    MAX(ulh.ListenedAt) AS LastListenedAt,
    (SELECT COUNT(*) FROM UserFavoriteSongs WHERE UserId = u.UserId) AS TotalFavorites,
    (SELECT COUNT(*) FROM UserFollowedArtists WHERE UserId = u.UserId) AS TotalFollowedArtists
FROM Users u
LEFT JOIN UserListeningHistory ulh ON u.UserId = ulh.UserId
WHERE u.IsActive = 1 AND u.DeletedAt IS NULL
GROUP BY u.UserId, u.Username, u.Email;
GO

PRINT 'View vw_UserListeningSummary created.';
GO

-- ============================================
-- VIEW: Album Details with Statistics
-- ============================================

GO
CREATE VIEW vw_AlbumDetails
AS
SELECT 
    al.AlbumId,
    al.Title,
    al.ReleaseDate,
    al.CoverImageUrl,
    al.Description,
    al.TotalTracks,
    al.TotalDuration,
    a.ArtistId,
    a.Name AS ArtistName,
    a.ProfileImageUrl AS ArtistImage,
    (SELECT SUM(PlayCount) FROM Songs WHERE AlbumId = al.AlbumId) AS TotalPlays,
    (SELECT SUM(LikeCount) FROM Songs WHERE AlbumId = al.AlbumId) AS TotalLikes,
    al.CreatedAt,
    al.UpdatedAt
FROM Albums al
INNER JOIN Artists a ON al.ArtistId = a.ArtistId
WHERE al.IsActive = 1 AND al.DeletedAt IS NULL
    AND a.IsActive = 1 AND a.DeletedAt IS NULL;
GO

PRINT 'View vw_AlbumDetails created.';
GO

-- ============================================
-- VIEW: User Subscription History Summary
-- ============================================

GO
CREATE VIEW vw_UserSubscriptionSummary
AS
SELECT 
    u.UserId,
    u.Username,
    u.Email,
    COUNT(ush.SubscriptionHistoryId) AS TotalSubscriptions,
    MIN(ush.StartDate) AS FirstSubscriptionDate,
    MAX(ush.EndDate) AS LatestSubscriptionEndDate,
    SUM(CASE WHEN ush.Status = 'active' THEN 1 ELSE 0 END) AS ActiveSubscriptions,
    SUM(CASE WHEN ush.Status = 'expired' THEN 1 ELSE 0 END) AS ExpiredSubscriptions,
    SUM(CASE WHEN ush.Status = 'cancelled' THEN 1 ELSE 0 END) AS CancelledSubscriptions,
    (SELECT SUM(Amount) FROM PaymentTransactions WHERE UserId = u.UserId AND TransactionStatus = 'completed') AS TotalSpent
FROM Users u
LEFT JOIN UserSubscriptionHistory ush ON u.UserId = ush.UserId
WHERE u.IsActive = 1 AND u.DeletedAt IS NULL
GROUP BY u.UserId, u.Username, u.Email;
GO

PRINT 'View vw_UserSubscriptionSummary created.';
GO

PRINT 'All views created successfully!';
GO
