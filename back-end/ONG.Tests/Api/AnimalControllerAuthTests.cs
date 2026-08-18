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
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using ONG.Domain.Entitites;
using ONG.Infrastructure.DataBase;
using Xunit;

namespace ONG.Tests.Api
{
    public class AnimalControllerAuthTests : IClassFixture<LoginApiFactory>
    {
        private const string TestJwtKey = "test-only-signing-key-at-least-32-bytes-long!";
        private const string TestJwtIssuer = "ong-api-tests";

        private readonly LoginApiFactory _factory;
        private readonly HttpClient _client;

        public AnimalControllerAuthTests(LoginApiFactory factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
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
            City = "Sao Paulo"
        };

        private async Task<string> GetValidTokenAsync()
        {
            var response = await _client.PostAsJsonAsync("/auth/login", new
            {
                Username = "fernanda",
                Password = "S3nhaForte!"
            });
            var body = await response.Content.ReadFromJsonAsync<JsonElement>();
            return body.GetProperty("token").GetString()!;
        }

        private static string MintExpiredToken()
        {
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(TestJwtKey));
            var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: TestJwtIssuer,
                claims: new[] { new Claim(JwtRegisteredClaimNames.Sub, "fernanda") },
                expires: DateTime.UtcNow.AddMinutes(-5),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string TamperToken(string token)
        {
            var segments = token.Split('.');
            var signature = segments[2];
            var mutatedChar = signature[0] == 'A' ? 'B' : 'A';
            segments[2] = mutatedChar + signature.Substring(1);
            return string.Join('.', segments);
        }

        private int CountPersistedAnimals()
        {
            using var scope = _factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ONGDbContext>();
            return db.Set<Animal>().Count();
        }

        [Fact]
        public async Task Create_ValidToken_Returns200()
        {
            var token = await GetValidTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.PostAsJsonAsync("/animals", ValidAnimalBody());

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task Create_NoAuthorizationHeader_Returns401AndDoesNotPersist()
        {
            var countBefore = CountPersistedAnimals();

            var response = await _client.PostAsJsonAsync("/animals", ValidAnimalBody());

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
            Assert.Equal(countBefore, CountPersistedAnimals());
        }

        [Fact]
        public async Task Create_MalformedToken_Returns401()
        {
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "not-a-jwt");

            var response = await _client.PostAsJsonAsync("/animals", ValidAnimalBody());

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Create_ExpiredToken_Returns401AndDoesNotPersist()
        {
            var countBefore = CountPersistedAnimals();
            var token = MintExpiredToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.PostAsJsonAsync("/animals", ValidAnimalBody());

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
            Assert.Equal(countBefore, CountPersistedAnimals());
        }

        [Fact]
        public async Task Create_TamperedToken_Returns401()
        {
            var token = await GetValidTokenAsync();
            var tampered = TamperToken(token);
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tampered);

            var response = await _client.PostAsJsonAsync("/animals", ValidAnimalBody());

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Create_ValidTokenMissingName_Returns400()
        {
            var token = await GetValidTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.PostAsJsonAsync("/animals", new
            {
                Species = "Dog",
                Sex = "Male",
                Size = "Medium",
                Description = "Friendly dog",
                approximateAge = 2,
                Image = "https://example.com/dog.jpg",
                Status = "Available",
                District = "Centro",
                City = "Sao Paulo"
            });

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
