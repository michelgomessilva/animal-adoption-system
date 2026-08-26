using System.Text.Json;
using System.Text.Json.Serialization;
using ONG.Domain.Entitites;

namespace ONG.API.Serialization
{
    public class SizeJsonConverter : JsonConverter<Size>
    {
        public override Size Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options)
        {
            var value = reader.GetString();

            return value switch
            {
                "Pequeno" => Size.Small,
                "Médio" => Size.Medium,
                "Grande" => Size.Large,
                _ => Size.None
            };
        }

        public override void Write(
            Utf8JsonWriter writer,
            Size value,
            JsonSerializerOptions options)
        {
            var size = value switch
            {
                Size.Small => "Pequeno",
                Size.Medium => "Médio",
                Size.Large => "Grande",
                _ => "Nenhum"
            };

            writer.WriteStringValue(size);
        }
    }
}