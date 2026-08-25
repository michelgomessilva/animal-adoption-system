using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ONG.Application.Security;

namespace ONG.Infrastructure.Security
{
    public class ClientTokenValidator : IClientTokenValidator
    {
        private readonly IConfiguration _configuration;

        public ClientTokenValidator(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public ClientTokenValidationStatus Validate(string token)
        {
            var handler = new JwtSecurityTokenHandler();

            if (!handler.CanReadToken(token))
            {
                return ClientTokenValidationStatus.StructurallyInvalid;
            }

            var key = _configuration["Jwt:Key"]!;
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = JwtTokenGenerator.ClientTokenIssuer,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
            };

            try
            {
                handler.ValidateToken(token, validationParameters, out _);
                return ClientTokenValidationStatus.Valid;
            }
            catch (SecurityTokenException)
            {
                return ClientTokenValidationStatus.SemanticallyInvalid;
            }
        }
    }
}
