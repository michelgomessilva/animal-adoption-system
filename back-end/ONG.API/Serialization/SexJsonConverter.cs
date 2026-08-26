using System.Text.Json;
using System.Text.Json.Serialization;
using ONG.Domain.Entitites;

namespace ONG.API.Serialization
{
    public class SexJsonConverter : JsonConverter<Sex>
    {
        public override Sex Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options)
        {
            var value = reader.GetString();

            return value switch
            {
                "Macho" => Sex.Male,
                "Fêmea" => Sex.Female,
                _ => Sex.None
            };
        }

        public override void Write(
            Utf8JsonWriter writer,
            Sex value,
            JsonSerializerOptions options)
        {
            var sex = value switch
            {
                Sex.Male => "Macho",
                Sex.Female => "Fêmea",
                _ => "Nenhum"
            };

            writer.WriteStringValue(sex);
        }
    }
}