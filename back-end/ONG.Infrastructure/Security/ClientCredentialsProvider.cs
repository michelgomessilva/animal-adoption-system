using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using ONG.Application.Security;

namespace ONG.Infrastructure.Security
{
    public class ClientCredentialsProvider : IClientCredentialsProvider
    {
        private const int MinimumSecretLength = 16;
        private const int MinExpiryMinutes = 1;
        private const int MaxExpiryMinutes = 60;

        private readonly IConfiguration _configuration;

        public ClientCredentialsProvider(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public ClientCredentials GetConfiguredClient()
        {
            var clientId = _configuration["ClientCredentials:ClientId"]!;
            var clientSecret = _configuration["ClientCredentials:ClientSecret"]!;
            var expiryMinutes = int.Parse(_configuration["ClientCredentials:ExpiryMinutes"]!);

            return new ClientCredentials(clientId, clientSecret, expiryMinutes);
        }

        public static void ValidateConfiguration(IConfiguration configuration)
        {
            var missing = new List<string>();

            if (string.IsNullOrWhiteSpace(configuration["ClientCredentials:ClientId"]))
            {
                missing.Add("ClientCredentials:ClientId");
            }

            var secret = configuration["ClientCredentials:ClientSecret"];
            if (string.IsNullOrWhiteSpace(secret))
            {
                missing.Add("ClientCredentials:ClientSecret");
            }
            else if (secret.Length < MinimumSecretLength)
            {
                missing.Add(
                    $"ClientCredentials:ClientSecret (must be at least {MinimumSecretLength} characters long)");
            }

            var expiryMinutes = configuration["ClientCredentials:ExpiryMinutes"];
            if (string.IsNullOrWhiteSpace(expiryMinutes))
            {
                missing.Add("ClientCredentials:ExpiryMinutes");
            }
            else if (!int.TryParse(expiryMinutes, out var parsedExpiry)
                || parsedExpiry < MinExpiryMinutes || parsedExpiry > MaxExpiryMinutes)
            {
                missing.Add(
                    $"ClientCredentials:ExpiryMinutes (must be an integer between {MinExpiryMinutes} and {MaxExpiryMinutes})");
            }

            if (missing.Count > 0)
            {
                throw new InvalidOperationException(
                    $"Missing required configuration key(s): {string.Join(", ", missing)}. " +
                    "These are required to issue client access tokens; the application " +
                    "cannot start without them.");
            }
        }
    }
}
