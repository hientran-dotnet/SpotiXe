using Microsoft.EntityFrameworkCore;
using MusicStreamingAPI.Entities;
using MusicStreamingAPI.Repositories.Interfaces;
using MusicStreamingAPI.Repositories.Implementations;
using MusicStreamingAPI.Services.Interfaces;
using MusicStreamingAPI.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure DbContext with SQL Server
builder.Services.AddDbContext<MusicStreamingDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptions => sqlServerOptions.EnableRetryOnFailure(
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

// Register Services
builder.Services.AddScoped<ISongService, SongService>();

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

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SpotiXe API V1");
        c.RoutePrefix = string.Empty; // Swagger at root
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// Health Check Endpoint
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
            Database = "SpotiXe",
            Server = "HIENTRAN",
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
