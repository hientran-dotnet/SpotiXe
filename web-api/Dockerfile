# ================= RUNTIME STAGE =================
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/out .

# Render sets the PORT env variable automatically
# Ensure the app listens on that port
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT}

# Optional: expose the port (doesn't affect Render routing, but helps local runs)
EXPOSE 8080

ENTRYPOINT ["dotnet", "SpotiXeApi.dll"]
