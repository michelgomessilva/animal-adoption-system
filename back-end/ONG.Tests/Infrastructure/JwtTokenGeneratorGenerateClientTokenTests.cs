using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using ONG.Infrastructure.Security;
using Xunit;

namespace ONG.Tests.Infrastructure
{
    public class JwtTokenGeneratorGenerateClientTokenTests
    {
        private static IConfiguration BuildConfiguration()
        {
            return new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "a-valid-signing-key-that-is-at-least-32-chars",
                ["Jwt:Issuer"] = "ong-api",
                ["Jwt:ExpiryMinutes"] = "60"
            }).Build();
        }

        [Fact]
        public void GenerateClientToken_ReturnsTokenWithSubjectAndExpiry()
        {
            var generator = new JwtTokenGenerator(BuildConfiguration());

            var token = generator.GenerateClientToken("front-web", 15);
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

            Assert.Equal("front-web", jwt.Subject);
            Assert.True(jwt.ValidTo > DateTime.UtcNow.AddMinutes(14));
            Assert.True(jwt.ValidTo <= DateTime.UtcNow.AddMinutes(15).AddSeconds(5));
        }

        [Fact]
        public void GenerateClientToken_IssuerIsDedicatedClientIssuer_NotJwtIssuerConfig()
        {
            var generator = new JwtTokenGenerator(BuildConfiguration());

            var token = generator.GenerateClientToken("front-web", 15);
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

            Assert.Equal("ong-api-oauth-clients", jwt.Issuer);
            Assert.NotEqual("ong-api", jwt.Issuer);
        }
    }
}
