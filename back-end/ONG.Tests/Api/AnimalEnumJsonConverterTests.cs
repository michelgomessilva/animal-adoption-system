using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using ONG.Domain.Entitites;
using Xunit;

namespace ONG.Tests.Api
{
    public class AnimalEnumJsonConverterTests
    {
        private static JsonSerializerOptions CreateOptions() => new()
        {
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
            Converters = { new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseUpper) }
        };

        [Fact]
        public void StatusConverter_SerializesAndDeserializesEnglishUppercase()
        {
            var options = CreateOptions();

            var json = JsonSerializer.Serialize(Status.InAdoptionProcess, options);
            Assert.Equal("\"IN_ADOPTION_PROCESS\"", json);

            var value = JsonSerializer.Deserialize<Status>("\"IN_ADOPTION_PROCESS\"", options);
            Assert.Equal(Status.InAdoptionProcess, value);
        }

        [Fact]
        public void SpeciesConverter_SerializesAndDeserializesEnglishUppercase()
        {
            var options = CreateOptions();

            var json = JsonSerializer.Serialize(Species.Dog, options);
            Assert.Equal("\"DOG\"", json);

            var value = JsonSerializer.Deserialize<Species>("\"DOG\"", options);
            Assert.Equal(Species.Dog, value);
        }

        [Fact]
        public void SexConverter_SerializesAndDeserializesEnglishUppercase()
        {
            var options = CreateOptions();

            var json = JsonSerializer.Serialize(Sex.Male, options);
            Assert.Equal("\"MALE\"", json);

            var value = JsonSerializer.Deserialize<Sex>("\"MALE\"", options);
            Assert.Equal(Sex.Male, value);
        }

        [Fact]
        public void SizeConverter_SerializesAndDeserializesEnglishUppercase()
        {
            var options = CreateOptions();

            var json = JsonSerializer.Serialize(Size.Medium, options);
            Assert.Equal("\"MEDIUM\"", json);

            var value = JsonSerializer.Deserialize<Size>("\"MEDIUM\"", options);
            Assert.Equal(Size.Medium, value);
        }

        [Fact]
        public void StatusConverter_DeserializingUnrecognizedValue_ThrowsJsonException()
        {
            var options = CreateOptions();

            Assert.Throws<JsonException>(() =>
                JsonSerializer.Deserialize<Status>("\"BOGUS\"", options));
        }

        [Fact]
        public void SpeciesConverter_DeserializingUnrecognizedValue_ThrowsJsonException()
        {
            var options = CreateOptions();

            Assert.Throws<JsonException>(() =>
                JsonSerializer.Deserialize<Species>("\"ELEPHANT\"", options));
        }
    }
}