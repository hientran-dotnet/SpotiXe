-- ============================================
-- SpotiXe Database Schema Design for SQL Server
-- Created: October 25, 2025
-- Database: SQL Server (Managed by SSMS)
-- Backend: Web API - C# (.NET)
-- Frontend: Web Admin - ReactJS
-- Mobile: Android App (Streaming Music)
-- ============================================

USE master;
GO

-- Drop database if exists (for development)
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'SpotiXe')
BEGIN
    ALTER DATABASE SpotiXe SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE SpotiXe;
END
GO

-- Create database
CREATE DATABASE SpotiXe
COLLATE SQL_Latin1_General_CP1_CI_AS;
GO

USE SpotiXe;
GO

PRINT 'Database SpotiXe created successfully.';
GO
