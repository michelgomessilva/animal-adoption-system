using Microsoft.AspNetCore.Mvc;
using ONG.Application.UseCases.Animals.CreateAnimal;
using ONG.Application.UseCases.Animals.AdoptAnimal;

namespace ONG.API.Controllers
{
    [ApiController]
    [Route("animals")]
    public class AnimalController : ControllerBase
    {
        private readonly CreateAnimalHandler _handler;
        private readonly AdoptAnimalHandler _adoptHandler;
        public AnimalController(
            CreateAnimalHandler handler,
            AdoptAnimalHandler adoptHandler)
        {
            _handler = handler;
            _adoptHandler = adoptHandler;
        }

        [HttpPost]
        public IActionResult Create(CreateAnimalCommand command)
        {
            _handler.Handle(command);

            return Ok();
        }

        [HttpPost("{id}/adopt")]
        public IActionResult Adopt(Guid id)
        {
            var command = new AdoptAnimalCommand
            {
                AnimalId = id
            };

            var animal = _adoptHandler.Handle(command);

            return Ok(animal);
        }
    }
}

