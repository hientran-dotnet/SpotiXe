FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY SpotiXeApi/*.csproj SpotiXeApi/
RUN dotnet restore "SpotiXeApi/SpotiXeApi.csproj"

# Copy the rest of the source code
COPY . .
RUN dotnet publish "SpotiXeApi/SpotiXeApi.csproj" -c Release -o /app/out

# ================= RUNTIME STAGE =================
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/out .

# Render sets the PORT env variable automatically, so use it dynamically
ENV ASPNETCORE_URLS=http://+:${PORT}
EXPOSE 10000

ENTRYPOINT ["dotnet", "SpotiXeApi.dll"]