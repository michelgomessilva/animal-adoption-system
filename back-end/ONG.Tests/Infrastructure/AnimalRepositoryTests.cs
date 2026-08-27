using System;
using Microsoft.EntityFrameworkCore;
using ONG.Application.Repositories;
using ONG.Domain.Entitites;
using ONG.Infrastructure.DataBase;
using ONG.Infrastructure.Repositories;
using Xunit;

namespace ONG.Tests.Infrastructure
{
    public class AnimalRepositoryTests
    {
        private static ONGDbContext CreateContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<ONGDbContext>()
                .UseInMemoryDatabase(dbName)
                .Options;
            return new ONGDbContext(options);
        }

        [Fact]
        public void GetAll_ReturnsAllPersistedAnimals()
        {
            var dbName = Guid.NewGuid().ToString();
            using var context = CreateContext(dbName);
            context.Set<Animal>().Add(new Animal(
                "Rex", Species.Dog, Sex.Male, Size.Medium, 2,
                "Friendly dog", "https://example.com/dog.jpg",
                Status.Available, "Centro", "Sao Paulo", "Sé"));
            context.Set<Animal>().Add(new Animal(
                "Mia", Species.Cat, Sex.Female, Size.Small, 1,
                "Calm cat", "https://example.com/cat.jpg",
                Status.Adopted, "Centro", "Sao Paulo", "Sé"));
            context.SaveChanges();

            var repository = new AnimalRepository(context);
            var result = repository.GetAll(new AnimalFilter());

            Assert.Equal(2, result.Count);
        }

        [Fact]
        public void GetAll_FiltersBySexSizeDistrictCityStatus_ReturnsMatchingSubset()
        {
            var dbName = Guid.NewGuid().ToString();
            using var context = CreateContext(dbName);
            context.Set<Animal>().Add(new Animal(
                "Rex", Species.Dog, Sex.Male, Size.Medium, 2,
                "Friendly dog", "https://example.com/dog.jpg",
                Status.Available, "Centro", "Sao Paulo", "Sé"));
            context.Set<Animal>().Add(new Animal(
                "Mia", Species.Cat, Sex.Female, Size.Small, 1,
                "Calm cat", "https://example.com/cat.jpg",
                Status.Adopted, "Centro", "Sao Paulo", "Sé"));
            context.Set<Animal>().Add(new Animal(
                "Bob", Species.Dog, Sex.Male, Size.Medium, 5,
                "Old dog", "https://example.com/bob.jpg",
                Status.Available, "Norte", "Sao Paulo", "Sé"));
            context.SaveChanges();

            var repository = new AnimalRepository(context);
            var result = repository.GetAll(new AnimalFilter
            {
                Sex = Sex.Male,
                Size = Size.Medium,
                District = "Centro",
                City = "Sao Paulo",
                Status = Status.Available
            });

            Assert.Single(result);
            Assert.Equal("Rex", result[0].Name);
        }

        [Fact]
        public void GetAll_DistrictCityFilter_IsCaseInsensitive()
        {
            var dbName = Guid.NewGuid().ToString();
            using var context = CreateContext(dbName);
            context.Set<Animal>().Add(new Animal(
                "Rex", Species.Dog, Sex.Male, Size.Medium, 2,
                "Friendly dog", "https://example.com/dog.jpg",
                Status.Available, "Centro", "Sao Paulo", "Sé"));
            context.SaveChanges();

            var repository = new AnimalRepository(context);
            var result = repository.GetAll(new AnimalFilter
            {
                District = "centro",
                City = "SAO PAULO"
            });

            Assert.Single(result);
        }

        [Fact]
        public void GetAll_OrderByEachSortField_ReturnsAscendingOrDescendingResults()
        {
            var dbName = Guid.NewGuid().ToString();
            using var context = CreateContext(dbName);
            context.Set<Animal>().Add(new Animal(
                "Zoe", Species.Dog, Sex.Female, Size.Small, 1,
                "d", "https://example.com/z.jpg", Status.Available, "Centro", "Sao Paulo", "Sé"));
            context.Set<Animal>().Add(new Animal(
                "Amy", Species.Cat, Sex.Female, Size.Large, 3,
                "d", "https://example.com/a.jpg", Status.Available, "Centro", "Sao Paulo", "Sé"));
            context.SaveChanges();

            var repository = new AnimalRepository(context);

            var byNameAsc = repository.GetAll(new AnimalFilter { OrderBy = AnimalSortField.Name });
            Assert.Equal(new[] { "Amy", "Zoe" }, byNameAsc.Select(a => a.Name));

            var byNameDesc = repository.GetAll(new AnimalFilter { OrderBy = AnimalSortField.Name, OrderDescending = true });
            Assert.Equal(new[] { "Zoe", "Amy" }, byNameDesc.Select(a => a.Name));

            var bySizeAsc = repository.GetAll(new AnimalFilter { OrderBy = AnimalSortField.Size });
            Assert.Equal(new[] { "Zoe", "Amy" }, bySizeAsc.Select(a => a.Name));

            var bySpeciesAsc = repository.GetAll(new AnimalFilter { OrderBy = AnimalSortField.Species });
            Assert.Equal(new[] { "Zoe", "Amy" }, bySpeciesAsc.Select(a => a.Name));

            var bySpeciesDesc = repository.GetAll(new AnimalFilter { OrderBy = AnimalSortField.Species, OrderDescending = true });
            Assert.Equal(new[] { "Amy", "Zoe" }, bySpeciesDesc.Select(a => a.Name));
        }

        [Fact]
        public void GetAll_SpeciesFilter_ReturnsMatchingSubset()
        {
            var dbName = Guid.NewGuid().ToString();
            using var context = CreateContext(dbName);
            context.Set<Animal>().Add(new Animal(
                "Rex", Species.Dog, Sex.Male, Size.Medium, 2,
                "Friendly dog", "https://example.com/dog.jpg",
                Status.Available, "Centro", "Sao Paulo", "Sé"));
            context.Set<Animal>().Add(new Animal(
                "Mia", Species.Cat, Sex.Female, Size.Small, 1,
                "Calm cat", "https://example.com/cat.jpg",
                Status.Available, "Centro", "Sao Paulo", "Sé"));
            context.SaveChanges();

            var repository = new AnimalRepository(context);
            var result = repository.GetAll(new AnimalFilter { Species = Species.Dog });

            Assert.Single(result);
            Assert.Equal("Rex", result[0].Name);
        }

        [Fact]
        public void GetById_ExistingId_ReturnsMatchingAnimal()
        {
            var dbName = Guid.NewGuid().ToString();
            using var context = CreateContext(dbName);
            var animal = new Animal(
                "Rex", Species.Dog, Sex.Male, Size.Medium, 2,
                "Friendly dog", "https://example.com/dog.jpg",
                Status.Available, "Centro", "Sao Paulo", "Sé");
            context.Set<Animal>().Add(animal);
            context.SaveChanges();

            var repository = new AnimalRepository(context);
            var result = repository.GetById(animal.Id);

            Assert.NotNull(result);
            Assert.Equal("Rex", result!.Name);
        }

        [Fact]
        public void GetById_NonExistentId_ReturnsNull()
        {
            var dbName = Guid.NewGuid().ToString();
            using var context = CreateContext(dbName);

            var repository = new AnimalRepository(context);
            var result = repository.GetById(Guid.NewGuid());

            Assert.Null(result);
        }

        [Fact]
        public void GetAll_NoAnimalsPersisted_ReturnsEmptyList()
        {
            var dbName = Guid.NewGuid().ToString();
            using var context = CreateContext(dbName);

            var repository = new AnimalRepository(context);
            var result = repository.GetAll(new AnimalFilter());

            Assert.Empty(result);
        }

        [Fact]
        public void GetAll_FilterMatchesNoAnimals_ReturnsEmptyList()
        {
            var dbName = Guid.NewGuid().ToString();
            using var context = CreateContext(dbName);
            context.Set<Animal>().Add(new Animal(
                "Rex", Species.Dog, Sex.Male, Size.Medium, 2,
                "Friendly dog", "https://example.com/dog.jpg",
                Status.Available, "Centro", "Sao Paulo", "Sé"));
            context.SaveChanges();

            var repository = new AnimalRepository(context);
            var result = repository.GetAll(new AnimalFilter { Species = Species.Cat });

            Assert.Empty(result);
        }
    }
}
