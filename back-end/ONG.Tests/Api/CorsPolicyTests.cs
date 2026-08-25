using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace ONG.Tests.Api
{
    public class CorsPolicyTests : IClassFixture<LoginApiFactory>
    {
        private readonly HttpClient _client;

        public CorsPolicyTests(LoginApiFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Get_CrossOriginRequest_AllowsAnyOrigin()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/animals");
            request.Headers.Add("Origin", "https://example-front.test");

            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.True(response.Headers.TryGetValues("Access-Control-Allow-Origin", out var values));
            Assert.Equal("*", Assert.Single(values!));
        }

        [Fact]
        public async Task Preflight_ForProtectedRoute_IsNotBlockedByCors()
        {
            var request = new HttpRequestMessage(HttpMethod.Options, "/api/animals");
            request.Headers.Add("Origin", "https://example-front.test");
            request.Headers.Add("Access-Control-Request-Method", "POST");
            request.Headers.Add("Access-Control-Request-Headers", "authorization,content-type");

            var response = await _client.SendAsync(request);

            Assert.NotEqual(HttpStatusCode.Unauthorized, response.StatusCode);
            Assert.NotEqual(HttpStatusCode.Forbidden, response.StatusCode);
            Assert.True(response.Headers.TryGetValues("Access-Control-Allow-Origin", out var values));
            Assert.Equal("*", Assert.Single(values!));
        }
    }
}
