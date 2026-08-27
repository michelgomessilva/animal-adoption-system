using System;
using System.Collections.Generic;
using System.Linq;
using ONG.Application.Repositories;
using ONG.Application.UseCases.Animals.UpdateAnimal;
using ONG.Domain.Entitites;
using Xunit;

namespace ONG.Tests.Application
{
    public class UpdateAnimalHandlerTests
    {
        private class FakeAnimalRepository : IAnimalRepository
        {
            private readonly List<Animal> _animals;

            public bool SaveChangesCalled { get; private set; }

            public FakeAnimalRepository(List<Animal> animals) => _animals = animals;

            public void Add(Animal animal) => _animals.Add(animal);
            public Animal? GetById(Guid id) => _animals.FirstOrDefault(a => a.Id == id);
            public void SaveChanges() => SaveChangesCalled = true;
            public List<Animal> GetAll(AnimalFilter filter) => _animals;
        }

        private static Animal ExistingAnimal() => new(
            "Rex", Species.Dog, Sex.Male, Size.Medium, 2,
            "Friendly dog", "https://example.com/dog.jpg",
            Status.Available, "Centro", "Sao Paulo", "Sé");

        private static UpdateAnimalCommand ValidCommand(Guid id) => new()
        {
            Id = id,
            Name = "Rex Updated",
            Species = Species.Cat,
            Sex = Sex.Female,
            Size = Size.Large,
            Description = "Calm cat",
            approximateAge = 5,
            Image = "https://example.com/cat.jpg",
            Status = Status.Adopted,
            District = "Norte",
            City = "Rio de Janeiro",
            Parish = "Centro"
        };

        [Fact]
        public void Handle_ExistingIdValidCommand_UpdatesPersistsAndReturnsAnimal()
        {
            var existing = ExistingAnimal();
            var repository = new FakeAnimalRepository(new List<Animal> { existing });
            var handler = new UpdateAnimalHandler(repository);

            var updated = handler.Handle(ValidCommand(existing.Id));

            Assert.NotNull(updated);
            Assert.Same(existing, updated);
            Assert.Equal("Rex Updated", updated!.Name);
            Assert.Equal(Species.Cat, updated.Species);
            Assert.Equal(Status.Adopted, updated.Status);
            Assert.True(repository.SaveChangesCalled);
        }

        [Fact]
        public void Handle_NonExistentId_ReturnsNullAndDoesNotSave()
        {
            var repository = new FakeAnimalRepository(new List<Animal>());
            var handler = new UpdateAnimalHandler(repository);

            var result = handler.Handle(ValidCommand(Guid.NewGuid()));

            Assert.Null(result);
            Assert.False(repository.SaveChangesCalled);
        }

        [Theory]
        [InlineData(nameof(Species), "Species is required")]
        [InlineData(nameof(Sex), "Sex is required")]
        [InlineData(nameof(Size), "Size is required")]
        [InlineData(nameof(Status), "Status is required")]
        public void Handle_RequiredEnumFieldIsNone_ThrowsArgumentExceptionAndDoesNotSave(string field, string expectedMessage)
        {
            var existing = ExistingAnimal();
            var repository = new FakeAnimalRepository(new List<Animal> { existing });
            var handler = new UpdateAnimalHandler(repository);
            var command = ValidCommand(existing.Id);

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
            Assert.Equal("Rex", existing.Name);
        }
    }
}
