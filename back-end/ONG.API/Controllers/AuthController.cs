using Microsoft.AspNetCore.Mvc;
using ONG.Application.UseCases.Auth.Login;

namespace ONG.API.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly LoginHandler _handler;

        public AuthController(LoginHandler handler)
        {
            _handler = handler;
        }

        [HttpPost("login")]
        public IActionResult Login(LoginCommand command)
        {
            var result = _handler.Handle(command);

            if (result is null)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            return Ok(result);
        }
    }
}
