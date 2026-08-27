using System;
using System.Collections.Generic;
using System.Linq;
using ONG.Application.Repositories;
using ONG.Application.UseCases.Animals.GetAnimalById;
using ONG.Domain.Entitites;
using Xunit;

namespace ONG.Tests.Application
{
    public class GetAnimalByIdHandlerTests
    {
        private class FakeAnimalRepository : IAnimalRepository
        {
            private readonly List<Animal> _animals;

            public FakeAnimalRepository(List<Animal> animals) => _animals = animals;

            public void Add(Animal animal) => _animals.Add(animal);
            public Animal? GetById(Guid id) => _animals.FirstOrDefault(a => a.Id == id);
            public void SaveChanges() { }
            public List<Animal> GetAll(AnimalFilter filter) => _animals;
        }

        [Fact]
        public void Handle_ExistingId_ReturnsMatchingAnimal()
        {
            var animal = new Animal(
                "Rex", Species.Dog, Sex.Male, Size.Medium, 2,
                "Friendly dog", "https://example.com/dog.jpg",
                Status.Available, "Centro", "Sao Paulo", "Sé");
            var repository = new FakeAnimalRepository(new List<Animal> { animal });
            var handler = new GetAnimalByIdHandler(repository);

            var result = handler.Handle(new GetAnimalByIdQuery { Id = animal.Id });

            Assert.Same(animal, result);
        }

        [Fact]
        public void Handle_NonExistentId_ReturnsNull()
        {
            var repository = new FakeAnimalRepository(new List<Animal>());
            var handler = new GetAnimalByIdHandler(repository);

            var result = handler.Handle(new GetAnimalByIdQuery { Id = Guid.NewGuid() });

            Assert.Null(result);
        }
    }
}
