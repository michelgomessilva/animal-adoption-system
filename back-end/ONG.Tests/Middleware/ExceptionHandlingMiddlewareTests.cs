using System;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ONG.API.Middleware;
using Xunit;

namespace ONG.Tests.Middleware
{
    public class ExceptionHandlingMiddlewareTests
    {
        private static async Task<IHost> BuildHostAsync(RequestDelegate terminal)
        {
            return await new HostBuilder()
                .ConfigureWebHost(builder =>
                {
                    builder.UseTestServer()
                        .ConfigureServices(services => services.AddProblemDetails())
                        .Configure(app =>
                        {
                            app.UseMiddleware<ExceptionHandlingMiddleware>();
                            app.Run(terminal);
                        });
                })
                .StartAsync();
        }

        [Fact]
        public async Task InvokeAsync_DownstreamThrowsArgumentException_Returns400ProblemDetails()
        {
            using var host = await BuildHostAsync(_ => throw new ArgumentException("Species is required"));
            var client = host.GetTestClient();

            var response = await client.GetAsync("/");

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            Assert.NotNull(response.Content.Headers.ContentType);
            Assert.Equal("application/problem+json", response.Content.Headers.ContentType!.MediaType);

            var body = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.False(string.IsNullOrWhiteSpace(body.GetProperty("title").GetString()));
            Assert.Equal("Species is required", body.GetProperty("detail").GetString());
        }

        [Fact]
        public async Task InvokeAsync_DownstreamThrowsGenericException_Returns500ProblemDetailsWithoutLeakingMessage()
        {
            const string secretExceptionMessage = "connection string leaked";
            using var host = await BuildHostAsync(_ => throw new InvalidOperationException(secretExceptionMessage));
            var client = host.GetTestClient();

            var response = await client.GetAsync("/");

            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
            Assert.NotNull(response.Content.Headers.ContentType);
            Assert.Equal("application/problem+json", response.Content.Headers.ContentType!.MediaType);

            var body = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.False(string.IsNullOrWhiteSpace(body.GetProperty("title").GetString()));
            var detail = body.GetProperty("detail").GetString();
            Assert.Equal("An unexpected error occurred.", detail);
            Assert.DoesNotContain(secretExceptionMessage, detail);
        }
    }
}
