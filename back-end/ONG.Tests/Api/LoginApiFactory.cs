using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using ONG.Infrastructure.DataBase;

namespace ONG.Tests.Api
{
    public class LoginApiFactory : WebApplicationFactory<Program>
    {
        private readonly string _dbName = Guid.NewGuid().ToString();

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureAppConfiguration((_, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["AdminSeed:Username"] = "fernanda",
                    ["AdminSeed:Password"] = "S3nhaForte!",
                    ["Jwt:Key"] = "test-only-signing-key-at-least-32-bytes-long!",
                    ["Jwt:Issuer"] = "ong-api-tests",
                    ["Jwt:ExpiryMinutes"] = "60",
                    ["PasswordHasher:IterationCount"] = "100000",
                    ["PasswordHasher:CompatibilityMode"] = "IdentityV3",
                    ["ClientCredentials:ClientId"] = "front-web",
                    ["ClientCredentials:ClientSecret"] = "test-only-client-secret-16chars",
                    ["ClientCredentials:ExpiryMinutes"] = "15"
                });
            });

            builder.ConfigureServices(services =>
            {
                // AddDbContext<ONGDbContext> in Program.cs registers both a
                // DbContextOptions<ONGDbContext> descriptor and an
                // IDbContextOptionsConfiguration<ONGDbContext> descriptor carrying the
                // Npgsql configuration delegate (EF Core combines every registered
                // IDbContextOptionsConfiguration<T> when building options). Removing only
                // the former leaves the Npgsql delegate registered alongside the InMemory
                // one added below, which EF Core rejects as "two providers registered" —
                // both descriptor types must be removed for the provider swap to work.
                services.RemoveAll<DbContextOptions<ONGDbContext>>();
                services.RemoveAll<IDbContextOptionsConfiguration<ONGDbContext>>();

                services.AddDbContext<ONGDbContext>(options =>
                    options.UseInMemoryDatabase(_dbName));
            });
        }
    }
}
