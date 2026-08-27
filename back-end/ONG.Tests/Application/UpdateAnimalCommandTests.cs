using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ONG.Application.UseCases.Animals.UpdateAnimal;
using ONG.Domain.Entitites;
using Xunit;

namespace ONG.Tests.Application
{
    public class UpdateAnimalCommandTests
    {
        private static UpdateAnimalCommand ValidCommand(string name) => new()
        {
            Id = Guid.NewGuid(),
            Name = name,
            Species = Species.Dog,
            Sex = Sex.Male,
            Size = Size.Medium,
            Description = "Friendly dog",
            approximateAge = 2,
            Image = "https://example.com/dog.jpg",
            Status = Status.Available,
            District = "Centro",
            City = "Sao Paulo",
            Parish = "Sé"
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
            Assert.Contains(results, r => r.MemberNames.Contains(nameof(UpdateAnimalCommand.Name)));
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

        [Fact]
        public void Validate_EmptyDescription_FailsWithDescriptionError()
        {
            var command = ValidCommand("Rex");
            command.Description = "";
            var context = new ValidationContext(command);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(command, context, results, validateAllProperties: true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains(nameof(UpdateAnimalCommand.Description)));
        }

        [Fact]
        public void Validate_EmptyDistrict_FailsWithDistrictError()
        {
            var command = ValidCommand("Rex");
            command.District = "";
            var context = new ValidationContext(command);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(command, context, results, validateAllProperties: true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains(nameof(UpdateAnimalCommand.District)));
        }

        [Fact]
        public void Validate_EmptyCity_FailsWithCityError()
        {
            var command = ValidCommand("Rex");
            command.City = "";
            var context = new ValidationContext(command);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(command, context, results, validateAllProperties: true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains(nameof(UpdateAnimalCommand.City)));
        }

        [Fact]
        public void Validate_EmptyParish_FailsWithParishError()
        {
            var command = ValidCommand("Rex");
            command.Parish = "";
            var context = new ValidationContext(command);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(command, context, results, validateAllProperties: true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains(nameof(UpdateAnimalCommand.Parish)));
        }

        [Theory]
        [InlineData(-1)]
        [InlineData(31)]
        public void Validate_ApproximateAgeOutOfRange_FailsWithApproximateAgeError(int approximateAge)
        {
            var command = ValidCommand("Rex");
            command.approximateAge = approximateAge;
            var context = new ValidationContext(command);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(command, context, results, validateAllProperties: true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains(nameof(UpdateAnimalCommand.approximateAge)));
        }

        [Fact]
        public void Validate_NameLongerThanMaxLength_FailsWithNameError()
        {
            var command = ValidCommand(new string('a', 21));
            var context = new ValidationContext(command);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(command, context, results, validateAllProperties: true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains(nameof(UpdateAnimalCommand.Name)));
        }
    }
}
