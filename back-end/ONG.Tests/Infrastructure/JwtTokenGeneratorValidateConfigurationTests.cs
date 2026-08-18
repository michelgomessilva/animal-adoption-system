using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using ONG.Infrastructure.Security;
using Xunit;

namespace ONG.Tests.Infrastructure
{
    public class JwtTokenGeneratorValidateConfigurationTests
    {
        private const string ValidKey = "a-valid-signing-key-that-is-at-least-32-chars";

        private static IConfiguration BuildConfiguration(Dictionary<string, string?> values)
        {
            return new ConfigurationBuilder().AddInMemoryCollection(values).Build();
        }

        [Fact]
        public void MissingAllKeys_ThrowsNamingAllThree()
        {
            var configuration = BuildConfiguration(new Dictionary<string, string?>());

            var exception = Assert.Throws<InvalidOperationException>(
                () => JwtTokenGenerator.ValidateConfiguration(configuration));

            Assert.Contains("Jwt:Key", exception.Message);
            Assert.Contains("Jwt:Issuer", exception.Message);
            Assert.Contains("Jwt:ExpiryMinutes", exception.Message);
        }

        [Fact]
        public void NonIntegerExpiryMinutes_ThrowsNamingExpiryMinutes()
        {
            var configuration = BuildConfiguration(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = ValidKey,
                ["Jwt:Issuer"] = "ong-api",
                ["Jwt:ExpiryMinutes"] = "not-a-number"
            });

            var exception = Assert.Throws<InvalidOperationException>(
                () => JwtTokenGenerator.ValidateConfiguration(configuration));

            Assert.Contains("Jwt:ExpiryMinutes", exception.Message);
        }

        [Fact]
        public void KeyShorterThan32Characters_ThrowsNamingKey()
        {
            var configuration = BuildConfiguration(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "too-short-key",
                ["Jwt:Issuer"] = "ong-api",
                ["Jwt:ExpiryMinutes"] = "60"
            });

            var exception = Assert.Throws<InvalidOperationException>(
                () => JwtTokenGenerator.ValidateConfiguration(configuration));

            Assert.Contains("Jwt:Key", exception.Message);
        }

        [Fact]
        public void ValidConfiguration_DoesNotThrow()
        {
            var configuration = BuildConfiguration(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = ValidKey,
                ["Jwt:Issuer"] = "ong-api",
                ["Jwt:ExpiryMinutes"] = "60"
            });

            var exception = Record.Exception(() => JwtTokenGenerator.ValidateConfiguration(configuration));

            Assert.Null(exception);
        }
    }
}
