using System.Text.Json.Serialization;

namespace ONG.Application.UseCases.OAuth.IssueClientToken
{
    public class IssueClientTokenResult
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; }

        [JsonPropertyName("token_type")]
        public string TokenType => "Bearer";

        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; }

        public IssueClientTokenResult(string accessToken, int expiresIn)
        {
            AccessToken = accessToken;
            ExpiresIn = expiresIn;
        }
    }
}
