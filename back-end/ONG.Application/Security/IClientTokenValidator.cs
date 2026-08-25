namespace ONG.Application.Security
{
    public enum ClientTokenValidationStatus
    {
        StructurallyInvalid,
        SemanticallyInvalid,
        Valid
    }

    public interface IClientTokenValidator
    {
        ClientTokenValidationStatus Validate(string token);
    }
}
