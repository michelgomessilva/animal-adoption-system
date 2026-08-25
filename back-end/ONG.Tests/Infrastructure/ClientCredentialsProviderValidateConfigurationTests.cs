using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using ONG.Infrastructure.Security;
using Xunit;

namespace ONG.Tests.Infrastructure
{
    public class ClientCredentialsProviderValidateConfigurationTests
    {
        private const string ValidSecret = "a-valid-client-secret16";

        private static IConfiguration BuildConfiguration(Dictionary<string, string?> values)
        {
            return new ConfigurationBuilder().AddInMemoryCollection(values).Build();
        }

        [Fact]
        public void MissingAllKeys_ThrowsNamingAllThree()
        {
            var configuration = BuildConfiguration(new Dictionary<string, string?>());

            var exception = Assert.Throws<InvalidOperationException>(
                () => ClientCredentialsProvider.ValidateConfiguration(configuration));

            Assert.Contains("ClientCredentials:ClientId", exception.Message);
            Assert.Contains("ClientCredentials:ClientSecret", exception.Message);
            Assert.Contains("ClientCredentials:ExpiryMinutes", exception.Message);
        }

        [Fact]
        public void SecretShorterThan16Characters_ThrowsNamingSecret()
        {
            var configuration = BuildConfiguration(new Dictionary<string, string?>
            {
                ["ClientCredentials:ClientId"] = "front-web",
                ["ClientCredentials:ClientSecret"] = "too-short",
                ["ClientCredentials:ExpiryMinutes"] = "15"
            });

            var exception = Assert.Throws<InvalidOperationException>(
                () => ClientCredentialsProvider.ValidateConfiguration(configuration));

            Assert.Contains("ClientCredentials:ClientSecret", exception.Message);
        }

        [Theory]
        [InlineData("not-a-number")]
        [InlineData("0")]
        [InlineData("61")]
        public void InvalidExpiryMinutes_ThrowsNamingExpiryMinutes(string expiryMinutes)
        {
            var configuration = BuildConfiguration(new Dictionary<string, string?>
            {
                ["ClientCredentials:ClientId"] = "front-web",
                ["ClientCredentials:ClientSecret"] = ValidSecret,
                ["ClientCredentials:ExpiryMinutes"] = expiryMinutes
            });

            var exception = Assert.Throws<InvalidOperationException>(
                () => ClientCredentialsProvider.ValidateConfiguration(configuration));

            Assert.Contains("ClientCredentials:ExpiryMinutes", exception.Message);
        }

        [Fact]
        public void ValidConfiguration_DoesNotThrow()
        {
            var configuration = BuildConfiguration(new Dictionary<string, string?>
            {
                ["ClientCredentials:ClientId"] = "front-web",
                ["ClientCredentials:ClientSecret"] = ValidSecret,
                ["ClientCredentials:ExpiryMinutes"] = "15"
            });

            var exception = Record.Exception(() => ClientCredentialsProvider.ValidateConfiguration(configuration));

            Assert.Null(exception);
        }
    }
}
