-- ============================================
-- SpotiXe - INSERT SAMPLE DATA
-- ============================================

USE SpotiXe;
GO

PRINT 'Inserting sample data...';
GO

-- ============================================
-- SUBSCRIPTION PLANS
-- ============================================

INSERT INTO SubscriptionPlans (Name, Description, Price, DurationDays, Features, MaxOfflineDownloads, StreamingQuality, IsAdFree, CanSkipUnlimited)
VALUES 
('Free', 'Basic plan with ads', 0.00, 30, '["Shuffle play", "Ad-supported", "Standard quality"]', 0, 'low', 0, 0),
('Premium', 'Ad-free listening with offline downloads', 59000.00, 30, '["Ad-free", "Offline downloads", "High quality audio", "Unlimited skips", "Play on any device"]', 10000, 'high', 1, 1),
('Family', 'Premium for up to 6 accounts', 89000.00, 30, '["Ad-free", "Offline downloads", "High quality audio", "Unlimited skips", "6 accounts", "Family mix playlist"]', 10000, 'lossless', 1, 1),
('Student', 'Discounted Premium for students', 29500.00, 30, '["Ad-free", "Offline downloads", "High quality audio", "Unlimited skips", "Student verification required"]', 10000, 'high', 1, 1);
GO

PRINT 'Subscription plans inserted.';
GO

-- ============================================
-- ARTISTS
-- ============================================

SET IDENTITY_INSERT Artists ON;

INSERT INTO Artists (ArtistId, Name, Bio, Country, DebutYear, TotalFollowers)
VALUES 
(1, N'Sơn Tùng M-TP', N'Vietnamese pop star and singer-songwriter', N'Vietnam', 2012, 5000000),
(2, N'Đen Vâu', N'Vietnamese rapper and producer', N'Vietnam', 2013, 3500000),
(3, N'Hòa Minzy', N'Vietnamese singer', N'Vietnam', 2014, 2000000),
(4, N'BLACKPINK', N'South Korean girl group', N'South Korea', 2016, 80000000),
(5, N'BTS', N'South Korean boy band', N'South Korea', 2013, 100000000),
(6, N'Ed Sheeran', N'English singer-songwriter', N'United Kingdom', 2011, 50000000),
(7, N'Taylor Swift', N'American singer-songwriter', N'United States', 2006, 70000000),
(8, N'The Weeknd', N'Canadian singer-songwriter', N'Canada', 2010, 45000000),
(9, N'Ariana Grande', N'American singer-songwriter', N'United States', 2011, 60000000),
(10, N'Drake', N'Canadian rapper and singer', N'Canada', 2009, 55000000);

SET IDENTITY_INSERT Artists OFF;
GO

PRINT 'Artists inserted.';
GO

-- ============================================
-- ALBUMS
-- ============================================

SET IDENTITY_INSERT Albums ON;

INSERT INTO Albums (AlbumId, Title, ReleaseDate, ArtistId, Description)
VALUES 
(1, N'm-tp M-TP', '2017-07-01', 1, N'Debut album by Sơn Tùng M-TP'),
(2, N'Sky Tour', '2019-01-01', 1, N'Second studio album'),
(3, N'Đi Về Nhà', '2019-06-15', 2, N'Album by Đen Vâu'),
(4, N'THE ALBUM', '2020-10-02', 4, N'First studio album by BLACKPINK'),
(5, N'Map of the Soul: 7', '2020-02-21', 5, N'Fourth Korean-language studio album by BTS'),
(6, N'÷ (Divide)', '2017-03-03', 6, N'Third studio album by Ed Sheeran'),
(7, N'Midnights', '2022-10-21', 7, N'Tenth studio album by Taylor Swift'),
(8, N'After Hours', '2020-03-20', 8, N'Fourth studio album by The Weeknd'),
(9, N'Positions', '2020-10-30', 9, N'Sixth studio album by Ariana Grande'),
(10, N'Certified Lover Boy', '2021-09-03', 10, N'Sixth studio album by Drake');

SET IDENTITY_INSERT Albums OFF;
GO

PRINT 'Albums inserted.';
GO

-- ============================================
-- SONGS
-- ============================================

SET IDENTITY_INSERT Songs ON;

INSERT INTO Songs (SongId, Title, Duration, ReleaseDate, AudioFileUrl, Genre, ArtistId, AlbumId, PlayCount, LikeCount, IsPublic, HasCopyright)
VALUES 
-- Sơn Tùng M-TP
(1, N'Lạc Trôi', 285, '2017-01-01', '/music/son-tung/lac-troi.mp3', N'Pop', 1, 1, 150000000, 5000000, 1, 1),
(2, N'Nơi Này Có Anh', 287, '2018-04-30', '/music/son-tung/noi-nay-co-anh.mp3', N'Pop', 1, 1, 200000000, 6000000, 1, 1),
(3, N'Hãy Trao Cho Anh', 245, '2019-07-01', '/music/son-tung/hay-trao-cho-anh.mp3', N'EDM', 1, 2, 180000000, 5500000, 1, 1),

-- Đen Vâu
(4, N'Bài Này Chill Phết', 220, '2019-06-15', '/music/den-vau/bai-nay-chill-phet.mp3', N'Rap', 2, 3, 120000000, 4000000, 1, 1),
(5, N'Đi Về Nhà', 245, '2019-06-15', '/music/den-vau/di-ve-nha.mp3', N'Rap', 2, 3, 100000000, 3500000, 1, 1),

-- BLACKPINK
(6, N'How You Like That', 182, '2020-06-26', '/music/blackpink/how-you-like-that.mp3', N'K-Pop', 4, 4, 900000000, 25000000, 1, 1),
(7, N'Ice Cream (with Selena Gomez)', 176, '2020-08-28', '/music/blackpink/ice-cream.mp3', N'K-Pop', 4, 4, 850000000, 22000000, 1, 1),
(8, N'Lovesick Girls', 193, '2020-10-02', '/music/blackpink/lovesick-girls.mp3', N'K-Pop', 4, 4, 800000000, 20000000, 1, 1),

-- BTS
(9, N'Dynamite', 199, '2020-08-21', '/music/bts/dynamite.mp3', N'K-Pop', 5, 5, 1200000000, 30000000, 1, 1),
(10, N'Boy With Luv (feat. Halsey)', 230, '2019-04-12', '/music/bts/boy-with-luv.mp3', N'K-Pop', 5, 5, 1100000000, 28000000, 1, 1),

-- Ed Sheeran
(11, N'Shape of You', 234, '2017-01-06', '/music/ed-sheeran/shape-of-you.mp3', N'Pop', 6, 6, 3500000000, 40000000, 1, 1),
(12, N'Perfect', 263, '2017-03-03', '/music/ed-sheeran/perfect.mp3', N'Pop', 6, 6, 2800000000, 35000000, 1, 1),

-- Taylor Swift
(13, N'Anti-Hero', 200, '2022-10-21', '/music/taylor-swift/anti-hero.mp3', N'Pop', 7, 7, 600000000, 15000000, 1, 1),
(14, N'Lavender Haze', 202, '2022-10-21', '/music/taylor-swift/lavender-haze.mp3', N'Pop', 7, 7, 500000000, 12000000, 1, 1),

-- The Weeknd
(15, N'Blinding Lights', 200, '2019-11-29', '/music/the-weeknd/blinding-lights.mp3', N'R&B', 8, 8, 4000000000, 50000000, 1, 1),
(16, N'Save Your Tears', 215, '2020-03-20', '/music/the-weeknd/save-your-tears.mp3', N'R&B', 8, 8, 2500000000, 30000000, 1, 1),

-- Ariana Grande
(17, N'positions', 172, '2020-10-23', '/music/ariana-grande/positions.mp3', N'Pop', 9, 9, 700000000, 18000000, 1, 1),
(18, N'34+35', 173, '2020-10-30', '/music/ariana-grande/34-35.mp3', N'Pop', 9, 9, 650000000, 16000000, 1, 1),

-- Drake
(19, N'Way 2 Sexy (feat. Future & Young Thug)', 260, '2021-09-03', '/music/drake/way-2-sexy.mp3', N'Hip Hop', 10, 10, 800000000, 20000000, 1, 1),
(20, N'Girls Want Girls (feat. Lil Baby)', 244, '2021-09-03', '/music/drake/girls-want-girls.mp3', N'Hip Hop', 10, 10, 750000000, 18000000, 1, 1);

SET IDENTITY_INSERT Songs OFF;
GO

-- Update streaming URLs
UPDATE Songs SET 
    StreamingUrl = AudioFileUrl + '?quality=adaptive',
    LowQualityUrl = AudioFileUrl + '?quality=low',
    MediumQualityUrl = AudioFileUrl + '?quality=medium',
    HighQualityUrl = AudioFileUrl + '?quality=high',
    LosslessQualityUrl = AudioFileUrl + '?quality=lossless',
    FileSize = Duration * 320 * 1024 / 8, -- Approximate file size for 320kbps
    AudioFormat = 'mp3',
    Bitrate = 320;
GO

PRINT 'Songs inserted.';
GO

-- ============================================
-- USERS
-- ============================================

SET IDENTITY_INSERT Users ON;

INSERT INTO Users (UserId, Username, Email, PasswordHash, FullName, Gender, Country, CurrentPlanId, SubscriptionEndDate)
VALUES 
(1, 'admin', 'admin@spotixe.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', N'Admin User', 'Male', N'Vietnam', 2, DATEADD(MONTH, 1, GETDATE())),
(2, 'john_doe', 'john@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', N'John Doe', 'Male', N'United States', 2, DATEADD(MONTH, 1, GETDATE())),
(3, 'jane_smith', 'jane@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', N'Jane Smith', 'Female', N'United Kingdom', 3, DATEADD(MONTH, 1, GETDATE())),
(4, 'nguyen_van_a', 'nguyenvana@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', N'Nguyễn Văn A', 'Male', N'Vietnam', 1, NULL),
(5, 'le_thi_b', 'lethib@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', N'Lê Thị B', 'Female', N'Vietnam', 4, DATEADD(MONTH, 1, GETDATE()));

SET IDENTITY_INSERT Users OFF;

-- Update subscription dates
UPDATE Users SET SubscriptionStartDate = DATEADD(DAY, -15, GETDATE()) WHERE CurrentPlanId IS NOT NULL;
UPDATE Users SET LastLoginAt = GETDATE();
UPDATE Users SET EmailVerified = 1;
GO

PRINT 'Users inserted.';
GO

-- ============================================
-- USER FAVORITES
-- ============================================

INSERT INTO UserFavoriteSongs (UserId, SongId)
VALUES 
(1, 1), (1, 2), (1, 6), (1, 9), (1, 11),
(2, 11), (2, 12), (2, 15), (2, 17),
(3, 6), (3, 7), (3, 9), (3, 13), (3, 15),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5),
(5, 6), (5, 9), (5, 11), (5, 13), (5, 17);
GO

PRINT 'User favorites inserted.';
GO

-- ============================================
-- USER FOLLOWED ARTISTS
-- ============================================

INSERT INTO UserFollowedArtists (UserId, ArtistId)
VALUES 
(1, 1), (1, 2), (1, 4), (1, 6),
(2, 6), (2, 7), (2, 8),
(3, 4), (3, 5), (3, 7), (3, 9),
(4, 1), (4, 2), (4, 3),
(5, 4), (5, 5), (5, 6), (5, 7);
GO

PRINT 'User followed artists inserted.';
GO

-- ============================================
-- PLAYLISTS
-- ============================================

SET IDENTITY_INSERT Playlists ON;

INSERT INTO Playlists (PlaylistId, Name, Description, UserId, IsPublic, PlaylistType)
VALUES 
(1, N'My Favorites', N'My personal favorite songs', 1, 0, 'user_created'),
(2, N'Workout Mix', N'High energy songs for workout', 2, 1, 'user_created'),
(3, N'Chill Vibes', N'Relaxing music for studying', 3, 1, 'user_created'),
(4, N'Top Vietnam Hits', N'Best Vietnamese songs', 1, 1, 'system_recommended'),
(5, N'K-Pop Essentials', N'Must-listen K-Pop tracks', 1, 1, 'system_recommended');

SET IDENTITY_INSERT Playlists OFF;
GO

-- Add songs to playlists
INSERT INTO PlaylistSongs (PlaylistId, SongId, Position, AddedBy)
VALUES 
-- My Favorites
(1, 1, 1, 1), (1, 6, 2, 1), (1, 11, 3, 1), (1, 15, 4, 1),
-- Workout Mix
(2, 3, 1, 2), (2, 6, 2, 2), (2, 9, 3, 2), (2, 15, 4, 2), (2, 19, 5, 2),
-- Chill Vibes
(3, 4, 1, 3), (3, 5, 2, 3), (3, 12, 3, 3), (3, 16, 4, 3),
-- Top Vietnam Hits
(4, 1, 1, 1), (4, 2, 2, 1), (4, 3, 3, 1), (4, 4, 4, 1), (4, 5, 5, 1),
-- K-Pop Essentials
(5, 6, 1, 1), (5, 7, 2, 1), (5, 8, 3, 1), (5, 9, 4, 1), (5, 10, 5, 1);
GO

PRINT 'Playlists inserted.';
GO

-- ============================================
-- USER LISTENING HISTORY (Sample)
-- ============================================

DECLARE @i INT = 1;
DECLARE @UserId BIGINT;
DECLARE @SongId BIGINT;
DECLARE @DaysAgo INT;

WHILE @i <= 100
BEGIN
    SET @UserId = (SELECT TOP 1 UserId FROM Users ORDER BY NEWID());
    SET @SongId = (SELECT TOP 1 SongId FROM Songs ORDER BY NEWID());
    SET @DaysAgo = FLOOR(RAND() * 30); -- Random day in last 30 days
    
    INSERT INTO UserListeningHistory (UserId, SongId, ListenedAt, DurationListened, DeviceType, IsCompleted)
    VALUES (
        @UserId,
        @SongId,
        DATEADD(DAY, -@DaysAgo, DATEADD(HOUR, -FLOOR(RAND() * 24), GETDATE())),
        (SELECT Duration FROM Songs WHERE SongId = @SongId) * (0.5 + RAND() * 0.5), -- 50-100% of song
        CASE FLOOR(RAND() * 3) WHEN 0 THEN 'mobile' WHEN 1 THEN 'web' ELSE 'desktop' END,
        CASE WHEN RAND() > 0.3 THEN 1 ELSE 0 END -- 70% completion rate
    );
    
    SET @i = @i + 1;
END;
GO

PRINT 'User listening history inserted.';
GO

-- ============================================
-- PAYMENT TRANSACTIONS (Sample)
-- ============================================

INSERT INTO PaymentTransactions (UserId, PlanId, Amount, PaymentMethod, TransactionStatus, PaymentDate)
VALUES 
(1, 2, 59000.00, 'credit_card', 'completed', DATEADD(DAY, -15, GETDATE())),
(2, 2, 59000.00, 'momo', 'completed', DATEADD(DAY, -10, GETDATE())),
(3, 3, 89000.00, 'vnpay', 'completed', DATEADD(DAY, -20, GETDATE())),
(5, 4, 29500.00, 'zalopay', 'completed', DATEADD(DAY, -5, GETDATE()));
GO

PRINT 'Payment transactions inserted.';
GO

-- ============================================
-- DAILY STATS (Sample for last 7 days)
-- ============================================

DECLARE @j INT = 0;
WHILE @j < 7
BEGIN
    EXEC sp_GenerateDailyStats @Date = CAST(DATEADD(DAY, -@j, GETDATE()) AS DATE);
    SET @j = @j + 1;
END;
GO

PRINT 'Daily stats generated.';
GO

PRINT 'Sample data inserted successfully!';
GO
