namespace ONG.Application.UseCases.Auth.Login
{
    public class LoginResult
    {
        public string Token { get; }

        public LoginResult(string token)
        {
            Token = token;
        }
    }
}
