using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
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
            City = "Sao Paulo",
            Parish = "Se"
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
        public async Task Create_ValidToken_Returns201()
        {
            var token = await GetValidTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.PostAsJsonAsync("/api/animals", ValidAnimalBody());

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        [Fact]
        public async Task Create_NoAuthorizationHeader_Returns401AndDoesNotPersist()
        {
            var countBefore = CountPersistedAnimals();

            var response = await _client.PostAsJsonAsync("/api/animals", ValidAnimalBody());

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
            Assert.Equal(countBefore, CountPersistedAnimals());
        }

        [Fact]
        public async Task Create_MalformedToken_Returns401()
        {
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "not-a-jwt");

            var response = await _client.PostAsJsonAsync("/api/animals", ValidAnimalBody());

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Create_ExpiredToken_Returns401AndDoesNotPersist()
        {
            var countBefore = CountPersistedAnimals();
            var token = MintExpiredToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.PostAsJsonAsync("/api/animals", ValidAnimalBody());

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
            Assert.Equal(countBefore, CountPersistedAnimals());
        }

        [Fact]
        public async Task Create_TamperedToken_Returns401()
        {
            var token = await GetValidTokenAsync();
            var tampered = TamperToken(token);
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tampered);

            var response = await _client.PostAsJsonAsync("/api/animals", ValidAnimalBody());

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Create_ValidTokenMissingName_Returns400()
        {
            var token = await GetValidTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.PostAsJsonAsync("/api/animals", new
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

        private async Task<Guid> SeedAnimalAsync(
            string token,
            string status,
            string size = "Medium",
            string district = "Centro",
            string? name = null)
        {
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var body = new
            {
                Name = name ?? (status == "Available" ? "Rex" : "Mia"),
                Species = "Dog",
                Sex = "Male",
                Size = size,
                Description = "Test animal",
                approximateAge = 2,
                Image = "https://example.com/animal.jpg",
                Status = status,
                District = district,
                City = "Sao Paulo",
                Parish = "Se"
            };
            var response = await _client.PostAsJsonAsync("/api/animals", body);
            var created = await response.Content.ReadFromJsonAsync<JsonElement>();
            _client.DefaultRequestHeaders.Authorization = null;
            return created.GetProperty("id").GetGuid();
        }

        [Fact]
        public async Task List_NoAuthorizationHeader_ReturnsOnlyAvailableAnimals()
        {
            var token = await GetValidTokenAsync();
            await SeedAnimalAsync(token, "Available");
            await SeedAnimalAsync(token, "Adopted");

            var response = await _client.GetAsync("/api/animals");
            var body = await response.Content.ReadFromJsonAsync<JsonElement>();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var animals = body.EnumerateArray().ToList();
            Assert.All(animals, a => Assert.Equal("Available", a.GetProperty("status").GetString()));
            Assert.Contains(animals, a => a.GetProperty("name").GetString() == "Rex");
        }

        [Fact]
        public async Task List_ValidToken_ReturnsAllAnimals()
        {
            var token = await GetValidTokenAsync();
            await SeedAnimalAsync(token, "Available");
            await SeedAnimalAsync(token, "Adopted");
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.GetAsync("/api/animals");
            var body = await response.Content.ReadFromJsonAsync<JsonElement>();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.True(body.EnumerateArray().Count() >= 2);
        }

        [Fact]
        public async Task List_ExpiredToken_Returns200ScopedToAvailableOnly()
        {
            var token = await GetValidTokenAsync();
            await SeedAnimalAsync(token, "Available");
            await SeedAnimalAsync(token, "Adopted");
            var expired = MintExpiredToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", expired);

            var response = await _client.GetAsync("/api/animals");
            var body = await response.Content.ReadFromJsonAsync<JsonElement>();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.All(body.EnumerateArray(), a => Assert.Equal("Available", a.GetProperty("status").GetString()));
        }

        [Fact]
        public async Task List_TamperedToken_Returns200ScopedToAvailableOnly()
        {
            var token = await GetValidTokenAsync();
            await SeedAnimalAsync(token, "Available");
            await SeedAnimalAsync(token, "Adopted");
            var tampered = TamperToken(token);
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tampered);

            var response = await _client.GetAsync("/api/animals");
            var body = await response.Content.ReadFromJsonAsync<JsonElement>();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.All(body.EnumerateArray(), a => Assert.Equal("Available", a.GetProperty("status").GetString()));
        }

        [Fact]
        public async Task List_EmptyCatalogNoToken_Returns200WithEmptyList()
        {
            var response = await _client.GetAsync("/api/animals");
            var body = await response.Content.ReadFromJsonAsync<JsonElement>();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Equal(JsonValueKind.Array, body.ValueKind);
        }

        [Fact]
        public async Task List_SizeAndDistrictFilterAsAnonymous_ReturnsOnlyMatchingAvailableAnimals()
        {
            var token = await GetValidTokenAsync();
            await SeedAnimalAsync(token, "Available", size: "Small", district: "Centro");
            await SeedAnimalAsync(token, "Available", size: "Large", district: "Centro");
            await SeedAnimalAsync(token, "Adopted", size: "Small", district: "Centro");

            var response = await _client.GetAsync("/api/animals?size=Small&district=Centro");
            var body = await response.Content.ReadFromJsonAsync<JsonElement>();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var animals = body.EnumerateArray().ToList();
            Assert.NotEmpty(animals);
            Assert.All(animals, a =>
            {
                Assert.Equal("Small", a.GetProperty("size").GetString());
                Assert.Equal("Centro", a.GetProperty("district").GetString());
                Assert.Equal("Available", a.GetProperty("status").GetString());
            });
        }

        [Fact]
        public async Task List_StatusFilterWithValidAdminToken_ReturnsOnlyRequestedStatus()
        {
            var token = await GetValidTokenAsync();
            await SeedAnimalAsync(token, "Available", name: "Bella");
            await SeedAnimalAsync(token, "Adopted", name: "Amy");
            await SeedAnimalAsync(token, "Adopted", name: "Zoe");
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.GetAsync("/api/animals?status=Adopted&orderBy=name");
            var body = await response.Content.ReadFromJsonAsync<JsonElement>();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var animals = body.EnumerateArray().ToList();
            Assert.All(animals, a => Assert.Equal("Adopted", a.GetProperty("status").GetString()));
            var names = animals.Select(a => a.GetProperty("name").GetString()).ToList();
            Assert.Equal(names.OrderBy(n => n, StringComparer.Ordinal), names);
        }

        [Fact]
        public async Task List_InvalidSpeciesFilter_Returns400WithMessage()
        {
            var response = await _client.GetAsync("/api/animals?species=Elephant");
            var body = await response.Content.ReadFromJsonAsync<JsonElement>();

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            Assert.False(string.IsNullOrWhiteSpace(body.GetProperty("message").GetString()));
        }

        [Fact]
        public async Task List_InvalidOrderByFilter_Returns400WithMessage()
        {
            var response = await _client.GetAsync("/api/animals?orderBy=bogus");
            var body = await response.Content.ReadFromJsonAsync<JsonElement>();

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            Assert.False(string.IsNullOrWhiteSpace(body.GetProperty("message").GetString()));
        }

        [Fact]
        public async Task List_AnonymousStatusFilterAdopted_Returns200ScopedToAvailableOnlyNeverAdopted()
        {
            var token = await GetValidTokenAsync();
            await SeedAnimalAsync(token, "Available", name: "Bella");
            await SeedAnimalAsync(token, "Adopted", name: "Amy");

            var response = await _client.GetAsync("/api/animals?status=Adopted");
            var body = await response.Content.ReadFromJsonAsync<JsonElement>();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var animals = body.EnumerateArray().ToList();
            Assert.NotEmpty(animals);
            Assert.All(animals, a => Assert.Equal("Available", a.GetProperty("status").GetString()));
        }
    }
}
