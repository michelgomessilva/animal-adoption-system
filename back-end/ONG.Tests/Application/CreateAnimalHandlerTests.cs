using System;
using System.Collections.Generic;
using System.Linq;
using ONG.Application.Repositories;
using ONG.Application.UseCases.Animals.CreateAnimal;
using ONG.Domain.Entitites;
using Xunit;

namespace ONG.Tests.Application
{
    public class CreateAnimalHandlerTests
    {
        private class FakeAnimalRepository : IAnimalRepository
        {
            private readonly List<Animal> _animals = new();

            public bool SaveChangesCalled { get; private set; }

            public void Add(Animal animal) => _animals.Add(animal);
            public Animal? GetById(Guid id) => _animals.FirstOrDefault(a => a.Id == id);
            public void SaveChanges() => SaveChangesCalled = true;
            public List<Animal> GetAll(AnimalFilter filter) => _animals;
        }

        private static CreateAnimalCommand ValidCommand() => new()
        {
            Name = "Rex",
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

        [Fact]
        public void Handle_ValidCommand_PersistsAndReturnsAnimal()
        {
            var repository = new FakeAnimalRepository();
            var handler = new CreateAnimalHandler(repository);

            var animal = handler.Handle(ValidCommand());

            Assert.Equal("Rex", animal.Name);
            Assert.True(repository.SaveChangesCalled);
            Assert.Same(animal, repository.GetById(animal.Id));
        }

        [Theory]
        [InlineData(nameof(Species), "Species is required")]
        [InlineData(nameof(Sex), "Sex is required")]
        [InlineData(nameof(Size), "Size is required")]
        [InlineData(nameof(Status), "Status is required")]
        public void Handle_RequiredEnumFieldIsNone_ThrowsArgumentExceptionAndDoesNotPersist(string field, string expectedMessage)
        {
            var repository = new FakeAnimalRepository();
            var handler = new CreateAnimalHandler(repository);
            var command = ValidCommand();

            switch (field)
            {
                case nameof(Species): command.Species = Species.None; break;
                case nameof(Sex): command.Sex = Sex.None; break;
                case nameof(Size): command.Size = Size.None; break;
                case nameof(Status): command.Status = Status.None; break;
            }

            var ex = Assert.Throws<ArgumentException>(() => handler.Handle(command));

            Assert.Equal(expectedMessage, ex.Message);
            Assert.False(repository.SaveChangesCalled);
            Assert.Empty(repository.GetAll(new AnimalFilter()));
        }
    }
}
