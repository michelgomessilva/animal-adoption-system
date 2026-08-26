using System.Text.Json;
using System.Text.Json.Serialization;
using ONG.Domain.Entitites;

namespace ONG.API.Serialization
{
    public class SpeciesJsonConverter : JsonConverter<Species>
    {
        public override Species Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options)
        {
            var value = reader.GetString();

            return value switch
            {
                "Cão" => Species.Dog,
                "Gato" => Species.Cat,
                _ => Species.None
            };
        }

        public override void Write(
            Utf8JsonWriter writer,
            Species value,
            JsonSerializerOptions options)
        {
            var species = value switch
            {
                Species.Dog => "Cão",
                Species.Cat => "Gato",
                _ => "Nenhum"
            };

            writer.WriteStringValue(species);
        }
    }
}