using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace ONG.Tests.Api
{
    public class OAuthEndpointTests : IClassFixture<OAuthApiFactory>
    {
        private readonly HttpClient _client;

        public OAuthEndpointTests(OAuthApiFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Token_ValidClientCredentials_Returns200WithAccessToken()
        {
            var response = await _client.PostAsJsonAsync("/oauth/token", new
            {
                grant_type = "client_credentials",
                client_id = OAuthApiFactory.ConfiguredClientId,
                client_secret = OAuthApiFactory.ConfiguredClientSecret
            });

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var body = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.False(string.IsNullOrWhiteSpace(body.GetProperty("access_token").GetString()));
            Assert.Equal("Bearer", body.GetProperty("token_type").GetString());
            Assert.True(body.GetProperty("expires_in").GetInt32() > 0);
        }

        [Fact]
        public async Task Token_WrongClientSecret_Returns401WithGenericMessage()
        {
            var response = await _client.PostAsJsonAsync("/oauth/token", new
            {
                grant_type = "client_credentials",
                client_id = OAuthApiFactory.ConfiguredClientId,
                client_secret = "wrong-secret-value"
            });

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);

            var body = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.Equal("Invalid client_id or client_secret.", body.GetProperty("message").GetString());
        }

        [Fact]
        public async Task Token_MissingClientId_Returns400()
        {
            var response = await _client.PostAsJsonAsync("/oauth/token", new
            {
                grant_type = "client_credentials",
                client_secret = OAuthApiFactory.ConfiguredClientSecret
            });

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
