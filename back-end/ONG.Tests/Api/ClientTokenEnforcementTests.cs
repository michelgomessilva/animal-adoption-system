using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using Xunit;

namespace ONG.Tests.Api
{
    public class ClientTokenEnforcementDisabledTests : IClassFixture<LoginApiFactory>
    {
        private readonly HttpClient _client;

        public ClientTokenEnforcementDisabledTests(LoginApiFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task List_FlagDisabledNoClientTokenHeader_Returns200()
        {
            var response = await _client.GetAsync("/api/animals");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task Token_FlagDisabledNoClientToken_IsReachable()
        {
            var response = await _client.PostAsJsonAsync("/oauth/token", new
            {
                grant_type = "client_credentials",
                client_id = "front-web",
                client_secret = "wrong-secret-value"
            });

            // Reaches OAuthController/IssueClientTokenHandler (401 for a bad secret,
            // not blocked upstream by enforcement) — proves the exemption works with
            // the flag off too.
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
    }

    public class ClientTokenEnforcementEnabledTests : IClassFixture<ClientTokenEnforcementApiFactory>
    {
        private const string ClientTokenHeaderName = "X-Client-Token";

        private readonly HttpClient _client;

        public ClientTokenEnforcementEnabledTests(ClientTokenEnforcementApiFactory factory)
        {
            _client = factory.CreateClient();
        }

        private static string MintToken(string issuer, string subject, int expiryMinutes)
        {
            var signingKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(ClientTokenEnforcementApiFactory.TestJwtKey));
            var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                claims: new[] { new Claim(JwtRegisteredClaimNames.Sub, subject) },
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string MintClientToken(int expiryMinutes = 15) =>
            MintToken("ong-api-oauth-clients", "front-web", expiryMinutes);

        private static string MintAdminToken() =>
            MintToken("ong-api-tests", "fernanda", expiryMinutes: 15);

        [Fact]
        public async Task List_FlagEnabledValidClientToken_Returns200()
        {
            _client.DefaultRequestHeaders.Add(ClientTokenHeaderName, MintClientToken());

            var response = await _client.GetAsync("/api/animals");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task Token_FlagEnabledNoClientToken_IsReachable()
        {
            var response = await _client.PostAsJsonAsync("/oauth/token", new
            {
                grant_type = "client_credentials",
                client_id = ClientTokenEnforcementApiFactory.ConfiguredClientId,
                client_secret = ClientTokenEnforcementApiFactory.ConfiguredClientSecret
            });

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task List_FlagEnabledNoClientTokenHeader_Returns401()
        {
            var response = await _client.GetAsync("/api/animals");

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
            Assert.NotNull(response.Content.Headers.ContentType);
            Assert.Equal("application/problem+json", response.Content.Headers.ContentType!.MediaType);

            var body = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.False(string.IsNullOrWhiteSpace(body.GetProperty("title").GetString()));
            Assert.False(string.IsNullOrWhiteSpace(body.GetProperty("detail").GetString()));
        }

        [Fact]
        public async Task List_ClientTokenHeaderEmpty_Returns400()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/animals");
            request.Headers.TryAddWithoutValidation(ClientTokenHeaderName, " ");

            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task List_ClientTokenHeaderNotAJwt_Returns400()
        {
            _client.DefaultRequestHeaders.Add(ClientTokenHeaderName, "not-a-jwt");

            var response = await _client.GetAsync("/api/animals");

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            Assert.NotNull(response.Content.Headers.ContentType);
            Assert.Equal("application/problem+json", response.Content.Headers.ContentType!.MediaType);

            var body = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.False(string.IsNullOrWhiteSpace(body.GetProperty("title").GetString()));
            Assert.False(string.IsNullOrWhiteSpace(body.GetProperty("detail").GetString()));
        }

        [Fact]
        public async Task List_ExpiredClientToken_Returns401()
        {
            _client.DefaultRequestHeaders.Add(ClientTokenHeaderName, MintClientToken(expiryMinutes: -5));

            var response = await _client.GetAsync("/api/animals");

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task List_ValidAdminTokenAsClientToken_Returns401()
        {
            _client.DefaultRequestHeaders.Add(ClientTokenHeaderName, MintAdminToken());

            var response = await _client.GetAsync("/api/animals");

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Create_ValidClientTokenNoAdminToken_Returns401()
        {
            _client.DefaultRequestHeaders.Add(ClientTokenHeaderName, MintClientToken());

            var response = await _client.PostAsJsonAsync("/api/animals", ValidAnimalBody());

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task List_ClientTokenIssuedByRealOAuthEndpoint_Returns200()
        {
            var tokenResponse = await _client.PostAsJsonAsync("/oauth/token", new
            {
                grant_type = "client_credentials",
                client_id = ClientTokenEnforcementApiFactory.ConfiguredClientId,
                client_secret = ClientTokenEnforcementApiFactory.ConfiguredClientSecret
            });
            var tokenBody = await tokenResponse.Content.ReadFromJsonAsync<JsonElement>();
            var issuedToken = tokenBody.GetProperty("access_token").GetString()!;

            _client.DefaultRequestHeaders.Add(ClientTokenHeaderName, issuedToken);

            var response = await _client.GetAsync("/api/animals");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task Create_ValidClientTokenAndValidAdminToken_Returns201()
        {
            _client.DefaultRequestHeaders.Add(ClientTokenHeaderName, MintClientToken());
            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", MintAdminToken());

            var response = await _client.PostAsJsonAsync("/api/animals", ValidAnimalBody());

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        private static object ValidAnimalBody() => new
        {
            Name = "Rex",
            Species = "Dog",
            Sex = "Male",
            Size = "Medium",
            Description = "Friendly dog",
            approximateAge = 2,
            Image = "https://example.com/dog.jpg",
            Status = "Available",
            District = "Centro",
            City = "Sao Paulo",
            Parish = "Se"
        };
    }
}
