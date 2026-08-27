using System;
using ONG.Domain.Entitites;
using Xunit;

namespace ONG.Tests.Domain
{
    public class AnimalTests
    {
        [Fact]
        public void Constructor_SetsAllFieldsAndGeneratesIdAndCreatedAt()
        {
            var before = DateTime.UtcNow;

            var animal = new Animal(
                "Rex", Species.Dog, Sex.Male, Size.Medium, 2,
                "Friendly dog", "https://example.com/dog.jpg",
                Status.Available, "Centro", "Sao Paulo", "Sé");

            var after = DateTime.UtcNow;

            Assert.NotEqual(Guid.Empty, animal.Id);
            Assert.Equal("Rex", animal.Name);
            Assert.Equal(Species.Dog, animal.Species);
            Assert.Equal(Sex.Male, animal.Sex);
            Assert.Equal(Size.Medium, animal.Size);
            Assert.Equal(2, animal.ApproximateAge);
            Assert.Equal("Friendly dog", animal.Description);
            Assert.Equal("https://example.com/dog.jpg", animal.Image);
            Assert.Equal(Status.Available, animal.Status);
            Assert.Equal("Centro", animal.District);
            Assert.Equal("Sao Paulo", animal.City);
            Assert.Equal("Sé", animal.Parish);
            Assert.InRange(animal.CreatedAt, before, after);
        }

        [Fact]
        public void Update_MutatesAllMutableFields_LeavesIdAndCreatedAtUnchanged()
        {
            var animal = new Animal(
                "Rex", Species.Dog, Sex.Male, Size.Medium, 2,
                "Friendly dog", "https://example.com/dog.jpg",
                Status.Available, "Centro", "Sao Paulo", "Sé");
            var originalId = animal.Id;
            var originalCreatedAt = animal.CreatedAt;

            animal.Update(
                "Rex Updated", Species.Cat, Sex.Female, Size.Large, 5,
                "Calm cat", "https://example.com/cat.jpg",
                Status.Adopted, "Norte", "Rio de Janeiro", "Centro");

            Assert.Equal(originalId, animal.Id);
            Assert.Equal(originalCreatedAt, animal.CreatedAt);
            Assert.Equal("Rex Updated", animal.Name);
            Assert.Equal(Species.Cat, animal.Species);
            Assert.Equal(Sex.Female, animal.Sex);
            Assert.Equal(Size.Large, animal.Size);
            Assert.Equal(5, animal.ApproximateAge);
            Assert.Equal("Calm cat", animal.Description);
            Assert.Equal("https://example.com/cat.jpg", animal.Image);
            Assert.Equal(Status.Adopted, animal.Status);
            Assert.Equal("Norte", animal.District);
            Assert.Equal("Rio de Janeiro", animal.City);
            Assert.Equal("Centro", animal.Parish);
        }
    }
}
