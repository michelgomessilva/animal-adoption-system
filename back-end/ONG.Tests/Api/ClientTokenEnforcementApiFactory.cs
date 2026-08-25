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
    public class ClientTokenEnforcementApiFactory : WebApplicationFactory<Program>
    {
        public const string ConfiguredClientId = "front-web";
        public const string ConfiguredClientSecret = "a-valid-client-secret16";
        public const string TestJwtKey = "test-only-signing-key-at-least-32-bytes-long!";

        private readonly string _dbName = Guid.NewGuid().ToString();

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureAppConfiguration((_, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["AdminSeed:Username"] = "fernanda",
                    ["AdminSeed:Password"] = "S3nhaForte!",
                    ["Jwt:Key"] = TestJwtKey,
                    ["Jwt:Issuer"] = "ong-api-tests",
                    ["Jwt:ExpiryMinutes"] = "60",
                    ["PasswordHasher:IterationCount"] = "100000",
                    ["PasswordHasher:CompatibilityMode"] = "IdentityV3",
                    ["ClientCredentials:ClientId"] = ConfiguredClientId,
                    ["ClientCredentials:ClientSecret"] = ConfiguredClientSecret,
                    ["ClientCredentials:ExpiryMinutes"] = "15",
                    ["ClientAuth:EnforcementEnabled"] = "true"
                });
            });

            builder.ConfigureServices(services =>
            {
                services.RemoveAll<DbContextOptions<ONGDbContext>>();
                services.RemoveAll<IDbContextOptionsConfiguration<ONGDbContext>>();

                services.AddDbContext<ONGDbContext>(options =>
                    options.UseInMemoryDatabase(_dbName));
            });
        }
    }
}
