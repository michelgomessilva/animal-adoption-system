using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Npgsql;
using ONG.Domain.Entitites;
using ONG.Infrastructure.DataBase;
using Xunit;

namespace ONG.Tests.Infrastructure
{
    public class ONGDbContextTests
    {
        // Same UserSecretsId as ONG.API/ONG.API.csproj — reads the
        // ConnectionStrings:DefaultConnection value already set locally via
        // `dotnet user-secrets set ... --project ONG.API` (see CLAUDE.md Commands).
        private const string ApiUserSecretsId = "6884aa88-cbe2-4af7-82a3-d0190d14010a";

        // Microsoft.EntityFrameworkCore.InMemory does not enforce secondary unique
        // indexes (only primary/alternate keys), so it cannot prove the Username unique
        // index configured in ONGDbContext.OnModelCreating is actually enforced. This one
        // test runs against a real local Postgres instance instead of the in-memory
        // provider used elsewhere in this suite; it requires `docker compose up -d postgres`
        // and the local user-secret to be set, and will not run unattended in CI (see
        // CLAUDE.md: CI does not run migrations or provide a live database). It targets a
        // dedicated, disposable database (not the shared "ongdb") so EnsureCreated/
        // EnsureDeleted never touch locally seeded Animal/Admin data.
        private static ONGDbContext CreatePostgresContext(string databaseName)
        {
            var configuration = new ConfigurationBuilder()
                .AddUserSecrets(ApiUserSecretsId)
                .Build();

            var baseConnectionString = configuration.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(baseConnectionString))
            {
                throw new InvalidOperationException(
                    "ConnectionStrings:DefaultConnection is not set. Run " +
                    "'dotnet user-secrets set \"ConnectionStrings:DefaultConnection\" ... " +
                    "--project ONG.API' and ensure 'docker compose up -d postgres' is running.");
            }

            var testConnectionString = new NpgsqlConnectionStringBuilder(baseConnectionString)
            {
                Database = databaseName
            }.ConnectionString;

            var options = new DbContextOptionsBuilder<ONGDbContext>()
                .UseNpgsql(testConnectionString)
                .Options;
            return new ONGDbContext(options);
        }

        [Fact]
        public void SavingSecondAdminWithDuplicateUsername_Throws()
        {
            var databaseName = $"ongdb_test_{Guid.NewGuid():N}";
            using var context = CreatePostgresContext(databaseName);
            context.Database.EnsureCreated();

            try
            {
                context.Admins.Add(new Admin("fernanda", "hash-1"));
                context.SaveChanges();

                context.Admins.Add(new Admin("fernanda", "hash-2"));

                Assert.Throws<DbUpdateException>(() => context.SaveChanges());
            }
            finally
            {
                context.Database.EnsureDeleted();
            }
        }
    }
}
