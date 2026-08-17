FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ONG.API/ONG.API.csproj ONG.API/
COPY ONG.Application/ONG.Application.csproj ONG.Application/
COPY ONG.Domain/ONG.Domain.csproj ONG.Domain/
COPY ONG.Infrastructure/ONG.Infrastructure.csproj ONG.Infrastructure/
RUN dotnet restore ONG.API/ONG.API.csproj

COPY ONG.API/ ONG.API/
COPY ONG.Application/ ONG.Application/
COPY ONG.Domain/ ONG.Domain/
COPY ONG.Infrastructure/ ONG.Infrastructure/
RUN dotnet publish ONG.API/ONG.API.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "ONG.API.dll"]
