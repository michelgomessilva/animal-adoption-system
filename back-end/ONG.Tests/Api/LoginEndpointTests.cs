using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace ONG.Tests.Api
{
    public class LoginEndpointTests : IClassFixture<LoginApiFactory>
    {
        private readonly HttpClient _client;

        public LoginEndpointTests(LoginApiFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Login_ValidCredentials_Returns200WithToken()
        {
            var response = await _client.PostAsJsonAsync("/auth/login", new
            {
                Username = "fernanda",
                Password = "S3nhaForte!"
            });

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var body = await response.Content.ReadFromJsonAsync<JsonElement>();
            var token = body.GetProperty("token").GetString();
            Assert.False(string.IsNullOrWhiteSpace(token));
        }

        [Fact]
        public async Task Login_WrongPassword_Returns401WithProblemDetails()
        {
            var response = await _client.PostAsJsonAsync("/auth/login", new
            {
                Username = "fernanda",
                Password = "wrong-password"
            });

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
            Assert.NotNull(response.Content.Headers.ContentType);
            Assert.Equal("application/problem+json", response.Content.Headers.ContentType!.MediaType);

            var body = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.False(string.IsNullOrWhiteSpace(body.GetProperty("title").GetString()));
            Assert.Equal("Invalid username or password.", body.GetProperty("detail").GetString());
        }

        [Fact]
        public async Task Login_MissingPassword_Returns400()
        {
            var response = await _client.PostAsJsonAsync("/auth/login", new
            {
                Username = "fernanda"
            });

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
