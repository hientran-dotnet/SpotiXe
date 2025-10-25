-- ============================================
-- SpotiXe - MASTER SETUP SCRIPT
-- Execute all database setup scripts in order
-- ============================================

PRINT '============================================';
PRINT 'SpotiXe Database Setup';
PRINT 'Starting at: ' + CONVERT(VARCHAR(30), GETDATE(), 120);
PRINT '============================================';
GO

-- Step 1: Create Database
PRINT '';
PRINT 'Step 1/7: Creating database...';
:r .\01_create_database.sql
GO

-- Step 2: Create Tables
PRINT '';
PRINT 'Step 2/7: Creating tables...';
:r .\02_create_tables.sql
GO

-- Step 3: Create Indexes
PRINT '';
PRINT 'Step 3/7: Creating indexes...';
:r .\03_create_indexes.sql
GO

-- Step 4: Create Triggers
PRINT '';
PRINT 'Step 4/7: Creating triggers...';
:r .\04_create_triggers.sql
GO

-- Step 5: Create Views
PRINT '';
PRINT 'Step 5/7: Creating views...';
:r .\05_create_views.sql
GO

-- Step 6: Create Stored Procedures
PRINT '';
PRINT 'Step 6/7: Creating stored procedures...';
:r .\06_create_stored_procedures.sql
GO

-- Step 7: Insert Sample Data (Optional - comment out for production)
PRINT '';
PRINT 'Step 7/7: Inserting sample data...';
:r .\07_insert_sample_data.sql
GO

PRINT '';
PRINT '============================================';
PRINT 'SpotiXe Database Setup Completed!';
PRINT 'Finished at: ' + CONVERT(VARCHAR(30), GETDATE(), 120);
PRINT '============================================';
PRINT '';
PRINT 'Database: SpotiXe';
PRINT 'Status: Ready';
PRINT '';
PRINT 'Next steps:';
PRINT '1. Verify all objects created successfully';
PRINT '2. Review sample data';
PRINT '3. Configure application connection string';
PRINT '4. Test API endpoints';
PRINT '';
GO

-- Display summary
USE SpotiXe;
GO

PRINT 'DATABASE SUMMARY:';
PRINT '================';
PRINT 'Tables: ' + CAST((SELECT COUNT(*) FROM sys.tables WHERE type = 'U') AS VARCHAR(10));
PRINT 'Views: ' + CAST((SELECT COUNT(*) FROM sys.views) AS VARCHAR(10));
PRINT 'Stored Procedures: ' + CAST((SELECT COUNT(*) FROM sys.procedures) AS VARCHAR(10));
PRINT 'Triggers: ' + CAST((SELECT COUNT(*) FROM sys.triggers WHERE parent_class = 1) AS VARCHAR(10));
PRINT 'Indexes: ' + CAST((SELECT COUNT(*) FROM sys.indexes WHERE index_id > 0) AS VARCHAR(10));
PRINT '';
GO
