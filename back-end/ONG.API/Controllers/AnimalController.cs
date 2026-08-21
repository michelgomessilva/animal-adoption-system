using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONG.Application.UseCases.Animals.CreateAnimal;
using ONG.Application.UseCases.Animals.ListAnimals;

namespace ONG.API.Controllers
{
    [ApiController]
    [Route("api/animals")]
    public class AnimalController : ControllerBase
    {
        private readonly CreateAnimalHandler _handler;
        private readonly ListAnimalsHandler _listHandler;

        public AnimalController(CreateAnimalHandler handler, ListAnimalsHandler listHandler)
        {
            _handler = handler;
            _listHandler = listHandler;
        }

        [Authorize]
        [HttpPost]
        public IActionResult Create(CreateAnimalCommand command)
        {

                var animal = _handler.Handle(command);

                return StatusCode(201, animal);
        }

        [HttpGet]
        public IActionResult List([FromQuery] ListAnimalsCommand command)
        {
            command.IsAuthenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;

            var animals = _listHandler.Handle(command);

            return Ok(animals);
        }
    }
}

