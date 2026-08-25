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
using Xunit;

namespace ONG.Tests.Api
{
    public class ClientCredentialsStartupFailureTests
    {
        [Fact]
        public void MissingClientCredentialsConfig_HostFailsToStart()
        {
            using var factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
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
                        ["PasswordHasher:CompatibilityMode"] = "IdentityV3"
                        // ClientCredentials:* deliberately omitted.
                    });
                });

                builder.ConfigureServices(services =>
                {
                    services.RemoveAll<DbContextOptions<ONGDbContext>>();
                    services.RemoveAll<IDbContextOptionsConfiguration<ONGDbContext>>();
                    services.AddDbContext<ONGDbContext>(options =>
                        options.UseInMemoryDatabase(Guid.NewGuid().ToString()));
                });
            });

            // The exact exception WebApplicationFactory surfaces when top-level Program.cs
            // code throws before app.Run() isn't pinned to one type in this codebase yet —
            // Assert.ThrowsAny keeps the test meaningful (host must fail to start) without
            // over-fitting to ASP.NET Core's internal wrapping behavior.
            Assert.ThrowsAny<Exception>(() => factory.CreateClient());
        }
    }
}
