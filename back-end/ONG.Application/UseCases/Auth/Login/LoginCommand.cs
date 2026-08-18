using System.ComponentModel.DataAnnotations;

namespace ONG.Application.UseCases.Auth.Login
{
    public class LoginCommand
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
