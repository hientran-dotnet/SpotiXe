-- ============================================
-- SpotiXe - CREATE TABLES (FIXED VERSION)
-- ============================================

USE SpotiXe;
GO

-- ============================================
-- A. QUẢN LÝ NGHỆ SĨ & ALBUM (ARTISTS & ALBUMS MANAGEMENT)
-- ============================================

-- Bảng Nghệ sĩ
CREATE TABLE Artists (
    ArtistId BIGINT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Bio NVARCHAR(MAX),
    ProfileImageUrl NVARCHAR(500),
    Country NVARCHAR(100),
    DebutYear INT,
    TotalFollowers BIGINT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    DeletedAt DATETIME2 NULL,
    
    CONSTRAINT CK_Artists_DebutYear CHECK (DebutYear >= 1900 AND DebutYear <= YEAR(GETDATE())),
    CONSTRAINT CK_Artists_TotalFollowers CHECK (TotalFollowers >= 0)
);
GO

PRINT 'Table Artists created.';
GO

-- Bảng Albums
CREATE TABLE Albums (
    AlbumId BIGINT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    ReleaseDate DATE,
    CoverImageUrl NVARCHAR(500),
    Description NVARCHAR(MAX),
    ArtistId BIGINT NOT NULL,
    TotalTracks INT DEFAULT 0,
    TotalDuration INT DEFAULT 0, -- Total duration in seconds
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    DeletedAt DATETIME2 NULL,
    
    CONSTRAINT FK_Albums_Artists FOREIGN KEY (ArtistId) 
        REFERENCES Artists(ArtistId) ON DELETE CASCADE,
    CONSTRAINT CK_Albums_TotalTracks CHECK (TotalTracks >= 0),
    CONSTRAINT CK_Albums_TotalDuration CHECK (TotalDuration >= 0)
);
GO

PRINT 'Table Albums created.';
GO

-- ============================================
-- B. QUẢN LÝ BÀI HÁT (SONGS MANAGEMENT)
-- ============================================

CREATE TABLE Songs (
    SongId BIGINT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Duration INT NOT NULL, -- Duration in seconds
    ReleaseDate DATE,
    AudioFileUrl NVARCHAR(500) NOT NULL, -- Path to audio file on server
    StreamingUrl NVARCHAR(500), -- HLS/DASH streaming URL
    CoverImageUrl NVARCHAR(500),
    Lyrics NVARCHAR(MAX),
    Genre NVARCHAR(100),
    
    -- Audio metadata
    FileSize BIGINT, -- File size in bytes
    AudioFormat NVARCHAR(20), -- mp3, flac, aac, etc
    Bitrate INT, -- Bitrate in kbps
    
    -- Streaming support for different quality levels
    LowQualityUrl NVARCHAR(500), -- For free users
    MediumQualityUrl NVARCHAR(500),
    HighQualityUrl NVARCHAR(500), -- For premium users
    LosslessQualityUrl NVARCHAR(500), -- For premium users
    
    -- Statistics
    PlayCount BIGINT DEFAULT 0,
    LikeCount BIGINT DEFAULT 0,
    
    -- Relationships
    ArtistId BIGINT NOT NULL,
    AlbumId BIGINT NULL,
    
    -- Status
    IsPublic BIT DEFAULT 1,
    HasCopyright BIT DEFAULT 1,
    IsActive BIT DEFAULT 1,
    
    -- Timestamps
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    DeletedAt DATETIME2 NULL,
    
    CONSTRAINT FK_Songs_Artists FOREIGN KEY (ArtistId) 
        REFERENCES Artists(ArtistId) ON DELETE NO ACTION, -- ✅ FIXED: Changed to NO ACTION
    CONSTRAINT FK_Songs_Albums FOREIGN KEY (AlbumId) 
        REFERENCES Albums(AlbumId) ON DELETE NO ACTION, -- ✅ FIXED: Changed to NO ACTION
    CONSTRAINT CK_Songs_Duration CHECK (Duration > 0),
    CONSTRAINT CK_Songs_FileSize CHECK (FileSize > 0),
    CONSTRAINT CK_Songs_PlayCount CHECK (PlayCount >= 0),
    CONSTRAINT CK_Songs_LikeCount CHECK (LikeCount >= 0)
);
GO

PRINT 'Table Songs created.';
GO

-- ============================================
-- C. QUẢN LÝ GÓI PREMIUM & NGƯỜI DÙNG
-- ============================================

CREATE TABLE SubscriptionPlans (
    PlanId BIGINT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(MAX),
    Price DECIMAL(10, 2) NOT NULL,
    DurationDays INT NOT NULL,
    Features NVARCHAR(MAX), -- JSON string: ["Feature1", "Feature2", ...]
    
    -- Premium benefits
    MaxOfflineDownloads INT DEFAULT 0,
    StreamingQuality NVARCHAR(20) DEFAULT 'medium', -- low, medium, high, lossless
    IsAdFree BIT DEFAULT 0,
    CanSkipUnlimited BIT DEFAULT 0,
    
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT CK_Plans_Price CHECK (Price >= 0),
    CONSTRAINT CK_Plans_DurationDays CHECK (DurationDays > 0),
    CONSTRAINT CK_Plans_MaxDownloads CHECK (MaxOfflineDownloads >= 0)
);
GO

PRINT 'Table SubscriptionPlans created.';
GO

CREATE TABLE Users (
    UserId BIGINT IDENTITY(1,1) PRIMARY KEY,
    
    -- Authentication
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL, -- BCrypt/Argon2 hash
    PhoneNumber NVARCHAR(20),
    
    -- Personal Information
    FullName NVARCHAR(255),
    DateOfBirth DATE,
    Gender NVARCHAR(10), -- Male, Female, Other
    AvatarUrl NVARCHAR(500),
    Country NVARCHAR(100),
    
    -- Subscription Information
    CurrentPlanId BIGINT NULL,
    SubscriptionStartDate DATETIME2 NULL,
    SubscriptionEndDate DATETIME2 NULL,
    -- ✅ FIXED: Removed PERSISTED to avoid non-deterministic error
    
    -- Account Status
    IsActive BIT DEFAULT 1,
    EmailVerified BIT DEFAULT 0,
    PhoneVerified BIT DEFAULT 0,
    LastLoginAt DATETIME2,
    
    -- Timestamps
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    DeletedAt DATETIME2 NULL,
    
    CONSTRAINT FK_Users_SubscriptionPlans FOREIGN KEY (CurrentPlanId) 
        REFERENCES SubscriptionPlans(PlanId) ON DELETE SET NULL,
    CONSTRAINT CK_Users_Gender CHECK (Gender IN ('Male', 'Female', 'Other'))
);
GO

-- ✅ ADDED: Create function to check subscription status
CREATE FUNCTION dbo.fn_IsSubscriptionActive(@UserId BIGINT)
RETURNS BIT
AS
BEGIN
    DECLARE @IsActive BIT = 0;
    
    SELECT @IsActive = CASE 
        WHEN SubscriptionEndDate > GETDATE() THEN 1 
        ELSE 0 
    END
    FROM Users
    WHERE UserId = @UserId;
    
    RETURN ISNULL(@IsActive, 0);
END;
GO

PRINT 'Table Users created with subscription check function.';
GO

-- ============================================
-- D. USER INTERACTIONS
-- ============================================

CREATE TABLE UserListeningHistory (
    HistoryId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId BIGINT NOT NULL,
    SongId BIGINT NOT NULL,
    ListenedAt DATETIME2 DEFAULT GETDATE(),
    DurationListened INT, -- Duration listened in seconds
    DeviceType NVARCHAR(50), -- web, mobile, desktop, smart_tv
    DeviceInfo NVARCHAR(255), -- Device details
    IPAddress NVARCHAR(45),
    IsCompleted BIT DEFAULT 0, -- Did user listen to the end?
    
    CONSTRAINT FK_History_Users FOREIGN KEY (UserId) 
        REFERENCES Users(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_History_Songs FOREIGN KEY (SongId) 
        REFERENCES Songs(SongId) ON DELETE CASCADE,
    CONSTRAINT CK_History_DurationListened CHECK (DurationListened >= 0)
);
GO

PRINT 'Table UserListeningHistory created.';
GO

CREATE TABLE UserFavoriteSongs (
    FavoriteId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId BIGINT NOT NULL,
    SongId BIGINT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_FavSongs_Users FOREIGN KEY (UserId) 
        REFERENCES Users(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_FavSongs_Songs FOREIGN KEY (SongId) 
        REFERENCES Songs(SongId) ON DELETE CASCADE,
    CONSTRAINT UQ_User_Song UNIQUE (UserId, SongId)
);
GO

PRINT 'Table UserFavoriteSongs created.';
GO

CREATE TABLE UserFollowedArtists (
    FollowId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId BIGINT NOT NULL,
    ArtistId BIGINT NOT NULL,
    FollowedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_FollowArtist_Users FOREIGN KEY (UserId) 
        REFERENCES Users(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_FollowArtist_Artists FOREIGN KEY (ArtistId) 
        REFERENCES Artists(ArtistId) ON DELETE CASCADE,
    CONSTRAINT UQ_User_Artist UNIQUE (UserId, ArtistId)
);
GO

PRINT 'Table UserFollowedArtists created.';
GO

-- ============================================
-- E. PLAYLISTS
-- ============================================

CREATE TABLE Playlists (
    PlaylistId BIGINT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    CoverImageUrl NVARCHAR(500),
    UserId BIGINT NOT NULL,
    
    -- Playlist type
    IsPublic BIT DEFAULT 0,
    IsSystemGenerated BIT DEFAULT 0, -- System-recommended playlists
    PlaylistType NVARCHAR(50) DEFAULT 'user_created', -- user_created, system_recommended
    
    -- Statistics
    TotalSongs INT DEFAULT 0,
    TotalDuration INT DEFAULT 0, -- in seconds
    FollowerCount BIGINT DEFAULT 0,
    
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    DeletedAt DATETIME2 NULL,
    
    CONSTRAINT FK_Playlists_Users FOREIGN KEY (UserId) 
        REFERENCES Users(UserId) ON DELETE CASCADE,
    CONSTRAINT CK_Playlists_TotalSongs CHECK (TotalSongs >= 0),
    CONSTRAINT CK_Playlists_FollowerCount CHECK (FollowerCount >= 0),
    CONSTRAINT CK_Playlists_Type CHECK (PlaylistType IN ('user_created', 'system_recommended'))
);
GO

PRINT 'Table Playlists created.';
GO

CREATE TABLE PlaylistSongs (
    PlaylistSongId BIGINT IDENTITY(1,1) PRIMARY KEY,
    PlaylistId BIGINT NOT NULL,
    SongId BIGINT NOT NULL,
    Position INT NOT NULL, -- Order/position of song in playlist
    AddedAt DATETIME2 DEFAULT GETDATE(),
    AddedBy BIGINT, -- User who added this song
    
    CONSTRAINT FK_PlaylistSongs_Playlists FOREIGN KEY (PlaylistId) 
        REFERENCES Playlists(PlaylistId) ON DELETE CASCADE,
    CONSTRAINT FK_PlaylistSongs_Songs FOREIGN KEY (SongId) 
        REFERENCES Songs(SongId) ON DELETE CASCADE,
    CONSTRAINT FK_PlaylistSongs_Users FOREIGN KEY (AddedBy) 
        REFERENCES Users(UserId) ON DELETE NO ACTION,
    CONSTRAINT UQ_Playlist_Position UNIQUE (PlaylistId, Position)
);
GO

PRINT 'Table PlaylistSongs created.';
GO

CREATE TABLE UserFollowedPlaylists (
    FollowId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId BIGINT NOT NULL,
    PlaylistId BIGINT NOT NULL,
    FollowedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_FollowPlaylist_Users FOREIGN KEY (UserId) 
        REFERENCES Users(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_FollowPlaylist_Playlists FOREIGN KEY (PlaylistId) 
        REFERENCES Playlists(PlaylistId) ON DELETE NO ACTION,
    CONSTRAINT UQ_User_Playlist UNIQUE (UserId, PlaylistId)
);
GO

PRINT 'Table UserFollowedPlaylists created.';
GO

-- ============================================
-- F. SUBSCRIPTION & PAYMENTS
-- ============================================

CREATE TABLE UserSubscriptionHistory (
    SubscriptionHistoryId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId BIGINT NOT NULL,
    PlanId BIGINT NOT NULL,
    StartDate DATETIME2 NOT NULL,
    EndDate DATETIME2 NOT NULL,
    Status NVARCHAR(20) DEFAULT 'active', -- active, expired, cancelled
    CancellationReason NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_SubHistory_Users FOREIGN KEY (UserId) 
        REFERENCES Users(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_SubHistory_Plans FOREIGN KEY (PlanId) 
        REFERENCES SubscriptionPlans(PlanId) ON DELETE NO ACTION,
    CONSTRAINT CK_SubHistory_Status CHECK (Status IN ('active', 'expired', 'cancelled'))
);
GO

PRINT 'Table UserSubscriptionHistory created.';
GO

CREATE TABLE PaymentTransactions (
    TransactionId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId BIGINT NOT NULL,
    PlanId BIGINT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    Currency NVARCHAR(10) DEFAULT 'VND',
    PaymentMethod NVARCHAR(50), -- credit_card, paypal, momo, vnpay, zalopay, etc
    TransactionStatus NVARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
    PaymentDate DATETIME2 DEFAULT GETDATE(),
    
    -- Payment gateway details
    PaymentGatewayTransactionId NVARCHAR(255),
    PaymentGatewayResponse NVARCHAR(MAX),
    
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_Payment_Users FOREIGN KEY (UserId) 
        REFERENCES Users(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_Payment_Plans FOREIGN KEY (PlanId) 
        REFERENCES SubscriptionPlans(PlanId) ON DELETE NO ACTION,
    CONSTRAINT CK_Payment_Amount CHECK (Amount >= 0),
    CONSTRAINT CK_Payment_Status CHECK (TransactionStatus IN ('pending', 'completed', 'failed', 'refunded'))
);
GO

PRINT 'Table PaymentTransactions created.';
GO

-- ============================================
-- G. STREAMING SUPPORT
-- ============================================

CREATE TABLE DeviceSessions (
    SessionId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId BIGINT NOT NULL,
    DeviceToken NVARCHAR(255) UNIQUE NOT NULL,
    DeviceType NVARCHAR(50), -- web, android, ios, desktop
    DeviceInfo NVARCHAR(MAX), -- JSON with device details
    IPAddress NVARCHAR(45),
    IsActive BIT DEFAULT 1,
    LastActivityAt DATETIME2 DEFAULT GETDATE(),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_DeviceSession_Users FOREIGN KEY (UserId) 
        REFERENCES Users(UserId) ON DELETE CASCADE
);
GO

PRINT 'Table DeviceSessions created.';
GO

CREATE TABLE StreamingSessions (
    StreamingSessionId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId BIGINT NOT NULL,
    SongId BIGINT NOT NULL,
    DeviceSessionId BIGINT NOT NULL,
    SessionToken NVARCHAR(255) UNIQUE NOT NULL,
    StartTime DATETIME2 DEFAULT GETDATE(),
    EndTime DATETIME2 NULL,
    StreamingQuality NVARCHAR(20), -- low, medium, high, lossless
    BytesStreamed BIGINT DEFAULT 0,
    
    CONSTRAINT FK_Streaming_Users FOREIGN KEY (UserId) 
        REFERENCES Users(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_Streaming_Songs FOREIGN KEY (SongId) 
        REFERENCES Songs(SongId) ON DELETE CASCADE,
    CONSTRAINT FK_Streaming_DeviceSession FOREIGN KEY (DeviceSessionId) 
        REFERENCES DeviceSessions(SessionId) ON DELETE NO ACTION
);
GO

PRINT 'Table StreamingSessions created.';
GO

-- ============================================
-- H. REPORTS & ANALYTICS
-- ============================================

CREATE TABLE DailyStats (
    StatId BIGINT IDENTITY(1,1) PRIMARY KEY,
    Date DATE NOT NULL UNIQUE,
    TotalUsers BIGINT DEFAULT 0,
    TotalActiveUsers BIGINT DEFAULT 0,
    TotalPlays BIGINT DEFAULT 0,
    TotalNewUsers BIGINT DEFAULT 0,
    TotalPremiumUsers BIGINT DEFAULT 0,
    Revenue DECIMAL(12, 2) DEFAULT 0.00,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT CK_DailyStats_Counts CHECK (
        TotalUsers >= 0 AND 
        TotalActiveUsers >= 0 AND 
        TotalPlays >= 0 AND 
        TotalNewUsers >= 0 AND 
        TotalPremiumUsers >= 0
    )
);
GO

PRINT 'Table DailyStats created.';
GO

CREATE TABLE SongStats (
    SongStatId BIGINT IDENTITY(1,1) PRIMARY KEY,
    SongId BIGINT NOT NULL,
    Date DATE NOT NULL,
    PlayCount BIGINT DEFAULT 0,
    UniqueListeners BIGINT DEFAULT 0,
    SkipCount BIGINT DEFAULT 0, -- Number of times song was skipped
    CompletionRate DECIMAL(5, 2), -- Percentage of listeners who completed the song
    
    CONSTRAINT FK_SongStats_Songs FOREIGN KEY (SongId) 
        REFERENCES Songs(SongId) ON DELETE CASCADE,
    CONSTRAINT UQ_Song_Date UNIQUE (SongId, Date),
    CONSTRAINT CK_SongStats_Counts CHECK (PlayCount >= 0 AND UniqueListeners >= 0 AND SkipCount >= 0)
);
GO

PRINT 'Table SongStats created.';
GO

-- ============================================
-- I. LOGS & AUDIT
-- ============================================

CREATE TABLE UserActivityLogs (
    LogId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId BIGINT NULL,
    ActivityType NVARCHAR(100) NOT NULL, -- login, logout, search, play_song, create_playlist, etc
    ActivityDetails NVARCHAR(MAX), -- JSON with additional details
    IPAddress NVARCHAR(45),
    UserAgent NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_ActivityLogs_Users FOREIGN KEY (UserId) 
        REFERENCES Users(UserId) ON DELETE CASCADE
);
GO

PRINT 'Table UserActivityLogs created.';
GO

CREATE TABLE ErrorLogs (
    ErrorLogId BIGINT IDENTITY(1,1) PRIMARY KEY,
    ErrorType NVARCHAR(100),
    ErrorMessage NVARCHAR(MAX),
    StackTrace NVARCHAR(MAX),
    UserId BIGINT NULL,
    RequestUrl NVARCHAR(500),
    RequestMethod NVARCHAR(10),
    RequestBody NVARCHAR(MAX),
    IPAddress NVARCHAR(45),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_ErrorLogs_Users FOREIGN KEY (UserId) 
        REFERENCES Users(UserId) ON DELETE SET NULL
);
GO

PRINT 'Table ErrorLogs created.';
GO

PRINT '========================================';
PRINT 'All tables created successfully!';
PRINT '========================================';
GO