using System.Text.Json;
using ONG.API.Serialization;
using ONG.Domain.Entitites;
using Xunit;

namespace ONG.Tests.Api
{
    public class AnimalEnumJsonConverterTests
    {
        [Fact]
        public void StatusConverter_SerializesAndDeserializesPortuguese()
        {
            var options = new JsonSerializerOptions();
            options.Converters.Add(new StatusJsonConverter());

            var json = JsonSerializer.Serialize(Status.InAdoptionProcess, options);
            Assert.Equal("\"Em processo de adoção\"", json);

            var value = JsonSerializer.Deserialize<Status>(
                "\"Em processo de adoção\"", options);

            Assert.Equal(Status.InAdoptionProcess, value);
        }

        [Fact]
        public void SpeciesConverter_SerializesAndDeserializesPortuguese()
        {
            var options = new JsonSerializerOptions();
            options.Converters.Add(new SpeciesJsonConverter());

            var json = JsonSerializer.Serialize(Species.Dog, options);
            Assert.Equal("\"Cão\"", json);

            var value = JsonSerializer.Deserialize<Species>(
                "\"Cão\"", options);

            Assert.Equal(Species.Dog, value);
        }

        [Fact]
        public void SexConverter_SerializesAndDeserializesPortuguese()
        {
            var options = new JsonSerializerOptions();
            options.Converters.Add(new SexJsonConverter());

            var json = JsonSerializer.Serialize(Sex.Male, options);
            Assert.Equal("\"Macho\"", json);

            var value = JsonSerializer.Deserialize<Sex>(
                "\"Macho\"", options);

            Assert.Equal(Sex.Male, value);
        }

        [Fact]
        public void SizeConverter_SerializesAndDeserializesPortuguese()
        {
            var options = new JsonSerializerOptions();
            options.Converters.Add(new SizeJsonConverter());

            var json = JsonSerializer.Serialize(Size.Medium, options);
            Assert.Equal("\"Médio\"", json);

            var value = JsonSerializer.Deserialize<Size>(
                "\"Médio\"", options);

            Assert.Equal(Size.Medium, value);
        }
    }
}