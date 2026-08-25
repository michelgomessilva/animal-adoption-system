using ONG.Application.Security;
using ONG.Application.UseCases.OAuth.IssueClientToken;
using ONG.Domain.Entitites;
using Xunit;

namespace ONG.Tests.Application
{
    public class IssueClientTokenHandlerTests
    {
        private const string ConfiguredClientId = "front-web";
        private const string ConfiguredClientSecret = "a-valid-client-secret16";
        private const int ConfiguredExpiryMinutes = 15;

        private class FakeClientCredentialsProvider : IClientCredentialsProvider
        {
            public ClientCredentials GetConfiguredClient() =>
                new(ConfiguredClientId, ConfiguredClientSecret, ConfiguredExpiryMinutes);
        }

        private class FakeTokenGenerator : ITokenGenerator
        {
            public string? LastClientId { get; private set; }
            public int? LastExpiryMinutes { get; private set; }

            public string GenerateToken(Admin admin) => "admin-token";

            public string GenerateClientToken(string clientId, int expiryMinutes)
            {
                LastClientId = clientId;
                LastExpiryMinutes = expiryMinutes;
                return "known-client-token-value";
            }
        }

        [Fact]
        public void Handle_MatchingCredentials_ReturnsResultWithToken()
        {
            var tokenGenerator = new FakeTokenGenerator();
            var handler = new IssueClientTokenHandler(new FakeClientCredentialsProvider(), tokenGenerator);

            var result = handler.Handle(new IssueClientTokenCommand
            {
                GrantType = "client_credentials",
                ClientId = ConfiguredClientId,
                ClientSecret = ConfiguredClientSecret
            });

            Assert.NotNull(result);
            Assert.Equal("known-client-token-value", result!.AccessToken);
            Assert.Equal("Bearer", result.TokenType);
            Assert.Equal(ConfiguredExpiryMinutes * 60, result.ExpiresIn);
            Assert.Equal(ConfiguredClientId, tokenGenerator.LastClientId);
            Assert.Equal(ConfiguredExpiryMinutes, tokenGenerator.LastExpiryMinutes);
        }

        [Fact]
        public void Handle_WrongClientSecret_ReturnsNull()
        {
            var handler = new IssueClientTokenHandler(new FakeClientCredentialsProvider(), new FakeTokenGenerator());

            var result = handler.Handle(new IssueClientTokenCommand
            {
                GrantType = "client_credentials",
                ClientId = ConfiguredClientId,
                ClientSecret = "wrong-secret-value"
            });

            Assert.Null(result);
        }

        [Fact]
        public void Handle_WrongClientId_ReturnsNull()
        {
            var handler = new IssueClientTokenHandler(new FakeClientCredentialsProvider(), new FakeTokenGenerator());

            var result = handler.Handle(new IssueClientTokenCommand
            {
                GrantType = "client_credentials",
                ClientId = "unknown-client",
                ClientSecret = ConfiguredClientSecret
            });

            Assert.Null(result);
        }
    }
}
