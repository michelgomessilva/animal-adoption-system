using System.Security.Cryptography;
using System.Text;
using ONG.Application.Security;

namespace ONG.Application.UseCases.OAuth.IssueClientToken
{
    public class IssueClientTokenHandler
    {
        private readonly IClientCredentialsProvider _clientCredentialsProvider;
        private readonly ITokenGenerator _tokenGenerator;

        public IssueClientTokenHandler(
            IClientCredentialsProvider clientCredentialsProvider, ITokenGenerator tokenGenerator)
        {
            _clientCredentialsProvider = clientCredentialsProvider;
            _tokenGenerator = tokenGenerator;
        }

        public IssueClientTokenResult? Handle(IssueClientTokenCommand command)
        {
            var configured = _clientCredentialsProvider.GetConfiguredClient();

            var clientIdMatches = CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(command.ClientId), Encoding.UTF8.GetBytes(configured.ClientId));
            var clientSecretMatches = CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(command.ClientSecret), Encoding.UTF8.GetBytes(configured.ClientSecret));

            if (!clientIdMatches || !clientSecretMatches)
            {
                return null;
            }

            var token = _tokenGenerator.GenerateClientToken(configured.ClientId, configured.ExpiryMinutes);
            return new IssueClientTokenResult(token, configured.ExpiryMinutes * 60);
        }
    }
}
