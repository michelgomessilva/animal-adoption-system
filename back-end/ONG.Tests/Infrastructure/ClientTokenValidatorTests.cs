using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ONG.Application.Security;
using ONG.Infrastructure.Security;
using Xunit;

namespace ONG.Tests.Infrastructure
{
    public class ClientTokenValidatorTests
    {
        private const string TestJwtKey = "a-valid-signing-key-that-is-at-least-32-chars";
        private const string ClientTokenIssuer = "ong-api-oauth-clients";

        private static IConfiguration BuildConfiguration()
        {
            return new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = TestJwtKey,
                ["Jwt:Issuer"] = "ong-api",
                ["Jwt:ExpiryMinutes"] = "60"
            }).Build();
        }

        private static string MintToken(string issuer, int expiryMinutes)
        {
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(TestJwtKey));
            var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                claims: new[] { new Claim(JwtRegisteredClaimNames.Sub, "front-web") },
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [Fact]
        public void Validate_ValidClientToken_ReturnsValid()
        {
            var validator = new ClientTokenValidator(BuildConfiguration());
            var token = MintToken(ClientTokenIssuer, expiryMinutes: 15);

            var status = validator.Validate(token);

            Assert.Equal(ClientTokenValidationStatus.Valid, status);
        }

        [Fact]
        public void Validate_ExpiredClientToken_ReturnsSemanticallyInvalid()
        {
            var validator = new ClientTokenValidator(BuildConfiguration());
            var token = MintToken(ClientTokenIssuer, expiryMinutes: -5);

            var status = validator.Validate(token);

            Assert.Equal(ClientTokenValidationStatus.SemanticallyInvalid, status);
        }

        [Fact]
        public void Validate_AdminIssuerToken_ReturnsSemanticallyInvalid()
        {
            var validator = new ClientTokenValidator(BuildConfiguration());
            var token = MintToken("ong-api", expiryMinutes: 15);

            var status = validator.Validate(token);

            Assert.Equal(ClientTokenValidationStatus.SemanticallyInvalid, status);
        }

        [Fact]
        public void Validate_TamperedSignature_ReturnsSemanticallyInvalid()
        {
            var validator = new ClientTokenValidator(BuildConfiguration());
            var token = MintToken(ClientTokenIssuer, expiryMinutes: 15);
            var segments = token.Split('.');
            var mutatedChar = segments[2][0] == 'A' ? 'B' : 'A';
            segments[2] = mutatedChar + segments[2].Substring(1);
            var tampered = string.Join('.', segments);

            var status = validator.Validate(tampered);

            Assert.Equal(ClientTokenValidationStatus.SemanticallyInvalid, status);
        }

        [Fact]
        public void Validate_NonJwtString_ReturnsStructurallyInvalid()
        {
            var validator = new ClientTokenValidator(BuildConfiguration());

            var status = validator.Validate("not-a-jwt");

            Assert.Equal(ClientTokenValidationStatus.StructurallyInvalid, status);
        }
    }
}
