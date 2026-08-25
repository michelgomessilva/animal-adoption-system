using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ONG.Application.UseCases.OAuth.IssueClientToken
{
    public class IssueClientTokenCommand
    {
        [Required]
        [RegularExpression("^client_credentials$")]
        [JsonPropertyName("grant_type")]
        public string GrantType { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("client_id")]
        public string ClientId { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("client_secret")]
        public string ClientSecret { get; set; } = string.Empty;
    }
}
