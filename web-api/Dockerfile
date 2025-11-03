# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers for better caching
COPY ["SpotiXeApi/SpotiXeApi.csproj", "SpotiXeApi/"]
RUN dotnet restore "SpotiXeApi/SpotiXeApi.csproj"

# Copy the rest of the source
COPY . .

# Publish the app
WORKDIR /src/SpotiXeApi
RUN dotnet publish "SpotiXeApi.csproj" -c Release -o /app/out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# Entry point script to honor $PORT on Render
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Default container port; Render will set $PORT at runtime
EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
