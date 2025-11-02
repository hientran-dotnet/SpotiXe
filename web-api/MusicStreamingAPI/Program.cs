using Microsoft.EntityFrameworkCore;
using MusicStreamingAPI.Entities;
using MusicStreamingAPI.Repositories.Interfaces;
using MusicStreamingAPI.Repositories.Implementations;
using MusicStreamingAPI.Services.Interfaces;
using MusicStreamingAPI.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure DbContext with MySQL
builder.Services.AddDbContext<MusicStreamingDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection")),
        mySqlOptions => mySqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null
        )
    )
);

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Register Repositories
builder.Services.AddScoped<ISongRepository, SongRepository>();
builder.Services.AddScoped<IArtistRepository, ArtistRepository>();
builder.Services.AddScoped<IAlbumRepository, AlbumRepository>();

// Register Services
builder.Services.AddScoped<ISongService, SongService>();
builder.Services.AddScoped<IArtistService, ArtistService>();
builder.Services.AddScoped<IAlbumService, AlbumService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "SpotiXe Music Streaming API",
        Version = "v1",
        Description = "ASP.NET Core Web API for SpotiXe Music Streaming Platform",
        Contact = new()
        {
            Name = "SpotiXe Team",
            Email = "support@spotixe.io.vn"
        }
    });
});

// Only configure URLs when PORT environment variable is set (e.g., on Render)
// Otherwise, use launchSettings.json configuration for local development
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SpotiXe API V1");
    c.RoutePrefix = string.Empty;
});

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// Health check
app.MapGet("/api/health/database", async (MusicStreamingDbContext dbContext) =>
{
    try
    {
        var canConnect = await dbContext.Database.CanConnectAsync();
        if (!canConnect)
            return Results.Problem("Cannot connect to database");

        var artistCount = await dbContext.Artists.CountAsync();
        var songCount = await dbContext.Songs.CountAsync();
        var albumCount = await dbContext.Albums.CountAsync();
        var userCount = await dbContext.Users.CountAsync();

        return Results.Ok(new
        {
            Status = "Connected",
            Database = "railway",
            Server = "Railway MySQL (tramway.proxy.rlwy.net:13930)",
            Timestamp = DateTime.UtcNow,
            Statistics = new
            {
                Artists = artistCount,
                Songs = songCount,
                Albums = albumCount,
                Users = userCount
            }
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Database error: {ex.Message}");
    }
})
.WithName("DatabaseHealthCheck")
.WithTags("Health")
.WithOpenApi();

app.Run();
