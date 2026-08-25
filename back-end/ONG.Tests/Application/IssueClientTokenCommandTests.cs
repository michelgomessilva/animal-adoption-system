using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ONG.Application.UseCases.OAuth.IssueClientToken;
using Xunit;

namespace ONG.Tests.Application
{
    public class IssueClientTokenCommandTests
    {
        private static IssueClientTokenCommand ValidCommand() => new()
        {
            GrantType = "client_credentials",
            ClientId = "front-web",
            ClientSecret = "a-valid-client-secret16"
        };

        [Fact]
        public void Validate_MissingGrantType_FailsWithGrantTypeError()
        {
            var command = ValidCommand();
            command.GrantType = string.Empty;
            var context = new ValidationContext(command);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(command, context, results, validateAllProperties: true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains(nameof(IssueClientTokenCommand.GrantType)));
        }

        [Theory]
        [InlineData("password")]
        [InlineData("Client_Credentials")]
        public void Validate_WrongGrantType_FailsWithGrantTypeError(string grantType)
        {
            var command = ValidCommand();
            command.GrantType = grantType;
            var context = new ValidationContext(command);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(command, context, results, validateAllProperties: true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains(nameof(IssueClientTokenCommand.GrantType)));
        }

        [Fact]
        public void Validate_AllFieldsPopulated_Passes()
        {
            var command = ValidCommand();
            var context = new ValidationContext(command);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(command, context, results, validateAllProperties: true);

            Assert.True(isValid);
            Assert.Empty(results);
        }
    }
}
