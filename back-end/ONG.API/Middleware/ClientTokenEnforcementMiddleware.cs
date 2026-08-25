using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

        public async Task InvokeAsync(HttpContext context, IClientTokenValidator validator, IProblemDetailsService problemDetailsService)
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
                    await WriteStatus(context, problemDetailsService, StatusCodes.Status401Unauthorized, "Missing client access token.", "Missing client access token.");
                    return;
                }

                await _next(context);
                return;
            }

            switch (validator.Validate(clientToken))
            {
                case ClientTokenValidationStatus.StructurallyInvalid:
                    await WriteStatus(context, problemDetailsService, StatusCodes.Status400BadRequest, "Malformed client access token.", "Malformed client access token.");
                    return;
                case ClientTokenValidationStatus.SemanticallyInvalid:
                    await WriteStatus(context, problemDetailsService, StatusCodes.Status401Unauthorized, "Invalid or expired client access token.", "Invalid or expired client access token.");
                    return;
            }

            await _next(context);
        }

        private static async Task WriteStatus(HttpContext context, IProblemDetailsService problemDetailsService, int statusCode, string title, string detail)
        {
            context.Response.StatusCode = statusCode;

            await problemDetailsService.WriteAsync(new ProblemDetailsContext
            {
                HttpContext = context,
                ProblemDetails = new ProblemDetails
                {
                    Status = statusCode,
                    Title = title,
                    Detail = detail
                }
            });
        }
    }
}
