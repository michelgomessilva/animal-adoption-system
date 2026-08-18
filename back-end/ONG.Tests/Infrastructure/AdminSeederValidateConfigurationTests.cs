using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using ONG.Infrastructure.DataBase;
using Xunit;

namespace ONG.Tests.Infrastructure
{
    public class AdminSeederValidateConfigurationTests
    {
        private static IConfiguration BuildConfiguration(Dictionary<string, string?> values)
        {
            return new ConfigurationBuilder().AddInMemoryCollection(values).Build();
        }

        [Fact]
        public void MissingUsernameAndPassword_ThrowsNamingBothKeys()
        {
            var configuration = BuildConfiguration(new Dictionary<string, string?>());

            var exception = Assert.Throws<InvalidOperationException>(
                () => AdminSeeder.ValidateConfiguration(configuration));

            Assert.Contains("AdminSeed:Username", exception.Message);
            Assert.Contains("AdminSeed:Password", exception.Message);
        }

        [Fact]
        public void MissingPasswordOnly_ThrowsNamingOnlyPassword()
        {
            var configuration = BuildConfiguration(new Dictionary<string, string?>
            {
                ["AdminSeed:Username"] = "fernanda"
            });

            var exception = Assert.Throws<InvalidOperationException>(
                () => AdminSeeder.ValidateConfiguration(configuration));

            Assert.Contains("AdminSeed:Password", exception.Message);
            Assert.DoesNotContain("AdminSeed:Username", exception.Message);
        }

        [Fact]
        public void ValidConfiguration_DoesNotThrow()
        {
            var configuration = BuildConfiguration(new Dictionary<string, string?>
            {
                ["AdminSeed:Username"] = "fernanda",
                ["AdminSeed:Password"] = "S3nhaForte!",
                ["PasswordHasher:IterationCount"] = "100000",
                ["PasswordHasher:CompatibilityMode"] = "IdentityV3"
            });

            var exception = Record.Exception(() => AdminSeeder.ValidateConfiguration(configuration));

            Assert.Null(exception);
        }

        [Fact]
        public void MissingPasswordHasherKeys_ThrowsNamingBoth()
        {
            var configuration = BuildConfiguration(new Dictionary<string, string?>
            {
                ["AdminSeed:Username"] = "fernanda",
                ["AdminSeed:Password"] = "S3nhaForte!"
            });

            var exception = Assert.Throws<InvalidOperationException>(
                () => AdminSeeder.ValidateConfiguration(configuration));

            Assert.Contains("PasswordHasher:IterationCount", exception.Message);
            Assert.Contains("PasswordHasher:CompatibilityMode", exception.Message);
        }

        [Fact]
        public void NonIntegerIterationCount_ThrowsNamingIterationCount()
        {
            var configuration = BuildConfiguration(new Dictionary<string, string?>
            {
                ["AdminSeed:Username"] = "fernanda",
                ["AdminSeed:Password"] = "S3nhaForte!",
                ["PasswordHasher:IterationCount"] = "not-a-number",
                ["PasswordHasher:CompatibilityMode"] = "IdentityV3"
            });

            var exception = Assert.Throws<InvalidOperationException>(
                () => AdminSeeder.ValidateConfiguration(configuration));

            Assert.Contains("PasswordHasher:IterationCount", exception.Message);
        }

        [Fact]
        public void ZeroOrNegativeIterationCount_ThrowsNamingIterationCount()
        {
            var configuration = BuildConfiguration(new Dictionary<string, string?>
            {
                ["AdminSeed:Username"] = "fernanda",
                ["AdminSeed:Password"] = "S3nhaForte!",
                ["PasswordHasher:IterationCount"] = "0",
                ["PasswordHasher:CompatibilityMode"] = "IdentityV3"
            });

            var exception = Assert.Throws<InvalidOperationException>(
                () => AdminSeeder.ValidateConfiguration(configuration));

            Assert.Contains("PasswordHasher:IterationCount", exception.Message);
        }

        [Fact]
        public void LegacyIdentityV2CompatibilityMode_ThrowsNamingCompatibilityMode()
        {
            var configuration = BuildConfiguration(new Dictionary<string, string?>
            {
                ["AdminSeed:Username"] = "fernanda",
                ["AdminSeed:Password"] = "S3nhaForte!",
                ["PasswordHasher:IterationCount"] = "100000",
                ["PasswordHasher:CompatibilityMode"] = "IdentityV2"
            });

            var exception = Assert.Throws<InvalidOperationException>(
                () => AdminSeeder.ValidateConfiguration(configuration));

            Assert.Contains("PasswordHasher:CompatibilityMode", exception.Message);
        }
    }
}
