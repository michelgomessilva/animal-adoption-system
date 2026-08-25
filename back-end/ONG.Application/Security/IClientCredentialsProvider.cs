namespace ONG.Application.Security
{
    public record ClientCredentials(string ClientId, string ClientSecret, int ExpiryMinutes);

    public interface IClientCredentialsProvider
    {
        ClientCredentials GetConfiguredClient();
    }
}
