using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ONG.Domain.Entitites;
using ONG.Infrastructure.DataBase;
using Xunit;

namespace ONG.Tests.Infrastructure
{
    public class AdminSeederSeedTests
    {
        private static ONGDbContext CreateContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<ONGDbContext>()
                .UseInMemoryDatabase(dbName)
                .Options;
            return new ONGDbContext(options);
        }

        private static IConfiguration BuildConfiguration(string username, string password)
        {
            return new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["AdminSeed:Username"] = username,
                ["AdminSeed:Password"] = password
            }).Build();
        }

        [Fact]
        public void Seed_EmptyTable_InsertsAdminWithHashedNonPlaintextPassword()
        {
            var dbName = Guid.NewGuid().ToString();
            using var context = CreateContext(dbName);
            var configuration = BuildConfiguration("fernanda", "S3nhaForte!");

            AdminSeeder.Seed(context, configuration);

            var admin = Assert.Single(context.Admins);
            Assert.NotEqual("S3nhaForte!", admin.PasswordHash);
            var result = new PasswordHasher<Admin>()
                .VerifyHashedPassword(admin, admin.PasswordHash, "S3nhaForte!");
            Assert.Equal(PasswordVerificationResult.Success, result);
        }

        [Fact]
        public void Seed_NoExistingAdmin_ResultsInExactlyOneRowMatchingConfiguredUsername()
        {
            var dbName = Guid.NewGuid().ToString();
            using var context = CreateContext(dbName);
            var configuration = BuildConfiguration("fernanda", "S3nhaForte!");

            AdminSeeder.Seed(context, configuration);

            Assert.Equal(1, context.Admins.Count());
            Assert.Equal("fernanda", context.Admins.Single().Username);
        }
    }
}
