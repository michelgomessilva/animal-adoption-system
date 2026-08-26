using System.Text.Json;
using System.Text.Json.Serialization;
using ONG.Domain.Entitites;

namespace ONG.API.Serialization
{
    public class StatusJsonConverter : JsonConverter<Status>
    {
        public override Status Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options)
        {
            var value = reader.GetString();

            return value switch
            {
                "Disponível" or "Available" => Status.Available,
                "Em processo de adoção" or "InAdoptionProcess" => Status.InAdoptionProcess,
                "Adotado" or "Adopted" => Status.Adopted,
                _ => Status.None
            };
        }

        public override void Write(
            Utf8JsonWriter writer,
            Status value,
            JsonSerializerOptions options)
        {
            var status = value switch
            {
                Status.Available => "Disponível",
                Status.InAdoptionProcess => "Em processo de adoção",
                Status.Adopted => "Adotado",
                _ => "Nenhum"
            };

            writer.WriteStringValue(status);
        }
    }
}