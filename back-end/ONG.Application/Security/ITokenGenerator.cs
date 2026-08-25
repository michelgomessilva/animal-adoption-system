using ONG.Domain.Entitites;

namespace ONG.Application.Security
{
    public interface ITokenGenerator
    {
        string GenerateToken(Admin admin);

        string GenerateClientToken(string clientId, int expiryMinutes);
    }
}
