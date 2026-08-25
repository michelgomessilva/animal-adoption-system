using System;
using System.Collections.Generic;
using System.Linq;
using ONG.Application.Repositories;
using ONG.Application.UseCases.Animals.ListAnimals;
using ONG.Domain.Entitites;
using Xunit;

namespace ONG.Tests.Application
{
    public class ListAnimalsHandlerTests
    {
        private class FakeAnimalRepository : IAnimalRepository

        {
            private readonly List<Animal> _animals;

            public AnimalFilter? LastFilter { get; private set; }

            public FakeAnimalRepository(List<Animal> animals)
            {
                _animals = animals;
            }

            public void Add(Animal animal) => _animals.Add(animal);

            public Animal? GetById(Guid id)
            {
                return _animals.FirstOrDefault(animal => animal.Id == id);
            }
            public void SaveChanges() { }

            public List<Animal> GetAll(AnimalFilter filter)
            {
                LastFilter = filter;
                return _animals;
            }
        }

        private static List<Animal> SeedAnimals() => new()
        {
            new Animal("Rex", Species.Dog, Sex.Male, Size.Medium, 2,
                "Friendly dog", "https://example.com/dog.jpg",
                Status.Available, "Centro", "Sao Paulo", "Sé"),
            new Animal("Mia", Species.Cat, Sex.Female, Size.Small, 1,
                "Calm cat", "https://example.com/cat.jpg",
                Status.Adopted, "Centro", "Sao Paulo", "Sé"),
            new Animal("Bob", Species.Dog, Sex.Male, Size.Large, 5,
                "Old dog", "https://example.com/bob.jpg",
                Status.None, "Centro", "Sao Paulo", "Sé"),
        };

        [Fact]
        public void Handle_ValidSexSizeDistrictCityFilters_PassesTypedFilterToRepository()
        {
            var repository = new FakeAnimalRepository(SeedAnimals());
            var handler = new ListAnimalsHandler(repository);

            handler.Handle(new ListAnimalsCommand
            {
                IsAuthenticated = true,
                Sex = "male",
                Size = "medium",
                District = "  Centro  ",
                City = "  Sao Paulo  "
            });

            Assert.Equal(Sex.Male, repository.LastFilter!.Sex);
            Assert.Equal(Size.Medium, repository.LastFilter!.Size);
            Assert.Equal("Centro", repository.LastFilter!.District);
            Assert.Equal("Sao Paulo", repository.LastFilter!.City);
        }

        [Theory]
        [InlineData("species", "Elephant")]
        [InlineData("sex", "Alien")]
        [InlineData("size", "Huge")]
        [InlineData("status", "Missing")]
        [InlineData("species", "99")]
        [InlineData("sex", "99")]
        [InlineData("size", "99")]
        [InlineData("status", "99")]
        public void Handle_InvalidSpeciesSexSizeOrStatusValue_ThrowsArgumentException(string field, string value)
        {
            var repository = new FakeAnimalRepository(SeedAnimals());
            var handler = new ListAnimalsHandler(repository);
            var command = new ListAnimalsCommand { IsAuthenticated = true };

            switch (field)
            {
                case "species": command.Species = value; break;
                case "sex": command.Sex = value; break;
                case "size": command.Size = value; break;
                case "status": command.Status = value; break;
            }

            var ex = Assert.Throws<ArgumentException>(() => handler.Handle(command));
            Assert.Contains(field, ex.Message, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public void Handle_SpeciesFilterNone_ThrowsArgumentException()
        {
            var repository = new FakeAnimalRepository(SeedAnimals());
            var handler = new ListAnimalsHandler(repository);

            Assert.Throws<ArgumentException>(() => handler.Handle(new ListAnimalsCommand
            {
                IsAuthenticated = true,
                Species = "None"
            }));
        }

        [Theory]
        [InlineData("name", AnimalSortField.Name, false)]
        [InlineData("createdAt_desc", AnimalSortField.CreatedAt, true)]
        public void Handle_ValidOrderByAscendingAndDescending_ParsesFieldAndDirection(
            string orderBy, AnimalSortField expectedField, bool expectedDescending)
        {
            var repository = new FakeAnimalRepository(SeedAnimals());
            var handler = new ListAnimalsHandler(repository);

            handler.Handle(new ListAnimalsCommand { IsAuthenticated = true, OrderBy = orderBy });

            Assert.Equal(expectedField, repository.LastFilter!.OrderBy);
            Assert.Equal(expectedDescending, repository.LastFilter!.OrderDescending);
        }

        [Theory]
        [InlineData("bogus")]
        [InlineData("99")]
        public void Handle_InvalidOrderByValue_ThrowsArgumentException(string orderBy)
        {
            var repository = new FakeAnimalRepository(SeedAnimals());
            var handler = new ListAnimalsHandler(repository);

            Assert.Throws<ArgumentException>(() => handler.Handle(new ListAnimalsCommand
            {
                IsAuthenticated = true,
                OrderBy = orderBy
            }));
        }

        [Fact]
        public void Handle_AnonymousWithStatusFilter_OverridesEffectiveFilterToAvailable()
        {
            var repository = new FakeAnimalRepository(SeedAnimals());
            var handler = new ListAnimalsHandler(repository);

            handler.Handle(new ListAnimalsCommand { IsAuthenticated = false, Status = "Adopted" });

            Assert.Equal(Status.Available, repository.LastFilter!.Status);
        }

        [Fact]
        public void Handle_AuthenticatedWithStatusFilter_PassesRequestedStatusThrough()
        {
            var repository = new FakeAnimalRepository(SeedAnimals());
            var handler = new ListAnimalsHandler(repository);

            handler.Handle(new ListAnimalsCommand { IsAuthenticated = true, Status = "Adopted" });

            Assert.Equal(Status.Adopted, repository.LastFilter!.Status);
        }
    }
}
