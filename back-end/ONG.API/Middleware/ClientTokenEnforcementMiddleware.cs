using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using ONG.Application.Security;

namespace ONG.API.Middleware
{
    public class ClientTokenEnforcementMiddleware
    {
        private const string ExemptPath = "/oauth/token";
        private const string ClientTokenHeaderName = "X-Client-Token";

        private readonly RequestDelegate _next;
        private readonly ClientAuthOptions _options;

        public ClientTokenEnforcementMiddleware(RequestDelegate next, IOptions<ClientAuthOptions> options)
        {
            _next = next;
            _options = options.Value;
        }

        public async Task InvokeAsync(HttpContext context, IClientTokenValidator validator)
        {
            if (HttpMethods.IsPost(context.Request.Method)
                && string.Equals(context.Request.Path.Value, ExemptPath, StringComparison.OrdinalIgnoreCase))
            {
                await _next(context);
                return;
            }

            var clientToken = context.Request.Headers[ClientTokenHeaderName].ToString();

            if (string.IsNullOrEmpty(clientToken))
            {
                if (_options.EnforcementEnabled)
                {
                    await WriteStatus(context, StatusCodes.Status401Unauthorized, "Missing client access token.");
                    return;
                }

                await _next(context);
                return;
            }

            switch (validator.Validate(clientToken))
            {
                case ClientTokenValidationStatus.StructurallyInvalid:
                    await WriteStatus(context, StatusCodes.Status400BadRequest, "Malformed client access token.");
                    return;
                case ClientTokenValidationStatus.SemanticallyInvalid:
                    await WriteStatus(context, StatusCodes.Status401Unauthorized, "Invalid or expired client access token.");
                    return;
            }

            await _next(context);
        }

        private static async Task WriteStatus(HttpContext context, int statusCode, string message)
        {
            context.Response.StatusCode = statusCode;
            await context.Response.WriteAsJsonAsync(new { message });
        }
    }
}
