# ============= BUILD STAGE =============
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy everything and build the project
COPY . .
RUN dotnet publish -c Release -o /app/out

# ============= RUNTIME STAGE =============
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app/out .

# Expose the port Render will use
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# Start the API
ENTRYPOINT ["dotnet", "SpotiXeApi/SpotiXeApi.dll"]