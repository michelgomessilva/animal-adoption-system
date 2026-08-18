using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONG.Application.UseCases.Animals.CreateAnimal;

namespace ONG.API.Controllers
{
    [ApiController]
    [Route("animals")]
    public class AnimalController : ControllerBase
    {
        private readonly CreateAnimalHandler _handler;
        public AnimalController (CreateAnimalHandler handler)
        {
            _handler = handler;
        }

        [Authorize]
        [HttpPost]
        public IActionResult Create(CreateAnimalCommand command)
        {
            _handler.Handle(command);

            return Ok();
        }

    }
}

