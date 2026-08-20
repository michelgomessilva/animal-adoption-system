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
                Status.Available, "Centro", "Sao Paulo"));
            context.Set<Animal>().Add(new Animal(
                "Mia", Species.Cat, Sex.Female, Size.Small, 1,
                "Calm cat", "https://example.com/cat.jpg",
                Status.Adopted, "Centro", "Sao Paulo"));
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
                Status.Available, "Centro", "Sao Paulo"));
            context.Set<Animal>().Add(new Animal(
                "Mia", Species.Cat, Sex.Female, Size.Small, 1,
                "Calm cat", "https://example.com/cat.jpg",
                Status.Adopted, "Centro", "Sao Paulo"));
            context.Set<Animal>().Add(new Animal(
                "Bob", Species.Dog, Sex.Male, Size.Medium, 5,
                "Old dog", "https://example.com/bob.jpg",
                Status.Available, "Norte", "Sao Paulo"));
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
                Status.Available, "Centro", "Sao Paulo"));
            context.SaveChanges();

            var repository = new AnimalRepository(context);
            var result = repository.GetAll(new AnimalFilter
            {
                District = "centro",
                City = "SAO PAULO"
            });

            Assert.Single(result);
        }
    }
}
