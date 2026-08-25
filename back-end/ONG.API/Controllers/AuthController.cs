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
        [ProducesResponseType(typeof(LoginResult), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        public IActionResult Login(LoginCommand command)
        {
            var result = _handler.Handle(command);

            if (result is null)
            {
                return Problem(
                    statusCode: StatusCodes.Status401Unauthorized,
                    title: "Invalid credentials.",
                    detail: "Invalid username or password.");
            }

            return Ok(result);
        }
    }
}
