using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ONG.Application.Security;
using ONG.Domain.Entitites;

namespace ONG.Infrastructure.Security
{
    public class JwtTokenGenerator : ITokenGenerator
    {
        private readonly IConfiguration _configuration;

        public JwtTokenGenerator(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(Admin admin)
        {
            var key = _configuration["Jwt:Key"]!;
            var issuer = _configuration["Jwt:Issuer"]!;
            var expiryMinutes = int.Parse(_configuration["Jwt:ExpiryMinutes"]!);

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, admin.Username),
                new Claim("adminId", admin.Id.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private const int MinimumKeyLength = 32;

        public static void ValidateConfiguration(IConfiguration configuration)
        {
            var missing = new List<string>();

            var key = configuration["Jwt:Key"];
            if (string.IsNullOrWhiteSpace(key))
            {
                missing.Add("Jwt:Key");
            }
            else if (key.Length < MinimumKeyLength)
            {
                missing.Add($"Jwt:Key (must be at least {MinimumKeyLength} characters long for HMAC-SHA256)");
            }

            if (string.IsNullOrWhiteSpace(configuration["Jwt:Issuer"]))
            {
                missing.Add("Jwt:Issuer");
            }

            var expiryMinutes = configuration["Jwt:ExpiryMinutes"];
            if (string.IsNullOrWhiteSpace(expiryMinutes))
            {
                missing.Add("Jwt:ExpiryMinutes");
            }
            else if (!int.TryParse(expiryMinutes, out _))
            {
                missing.Add("Jwt:ExpiryMinutes (must be a valid integer)");
            }

            if (missing.Count > 0)
            {
                throw new InvalidOperationException(
                    $"Missing required configuration key(s): {string.Join(", ", missing)}. " +
                    "These are required to issue signed login tokens; the application " +
                    "cannot start without them.");
            }
        }
    }
}
