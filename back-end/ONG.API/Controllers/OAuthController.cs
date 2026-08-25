using Microsoft.AspNetCore.Mvc;
using ONG.Application.UseCases.OAuth.IssueClientToken;

namespace ONG.API.Controllers
{
    [ApiController]
    [Route("oauth")]
    public class OAuthController : ControllerBase
    {
        private readonly IssueClientTokenHandler _handler;

        public OAuthController(IssueClientTokenHandler handler)
        {
            _handler = handler;
        }

        [HttpPost("token")]
        public IActionResult Token(IssueClientTokenCommand command)
        {
            var result = _handler.Handle(command);

            if (result is null)
            {
                return Problem(
                    statusCode: StatusCodes.Status401Unauthorized,
                    title: "Invalid credentials.",
                    detail: "Invalid client_id or client_secret.");
            }

            return Ok(result);
        }
    }
}
