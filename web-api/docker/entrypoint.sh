#!/usr/bin/env sh
set -e

# If Render provides PORT, bind Kestrel to it
if [ -n "$PORT" ]; then
  export ASPNETCORE_URLS="http://0.0.0.0:$PORT"
fi

exec dotnet SpotiXeApi.dll
