using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using ONG.Application.UseCases.Animals.CreateAnimal;
using ONG.Domain.Entitites;
using Xunit;

namespace ONG.Tests.Application
{
    public class CreateAnimalCommandTests
    {
        private static CreateAnimalCommand ValidCommand(string name) => new()
        {
            Name = name,
            Species = Species.Dog,
            Sex = Sex.Male,
            Size = Size.Medium,
            Description = "Friendly dog",
            approximateAge = 2,
            Image = "https://example.com/dog.jpg",
            Status = Status.Available,
            District = "Centro",
            City = "Sao Paulo"
        };

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        public void Validate_EmptyOrWhitespaceName_FailsWithNameError(string name)
        {
            var command = ValidCommand(name);
            var context = new ValidationContext(command);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(command, context, results, validateAllProperties: true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains(nameof(CreateAnimalCommand.Name)));
        }

        [Fact]
        public void Validate_AllFieldsPopulated_Passes()
        {
            var command = ValidCommand("Rex");
            var context = new ValidationContext(command);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(command, context, results, validateAllProperties: true);

            Assert.True(isValid);
            Assert.Empty(results);
        }
    }
}
