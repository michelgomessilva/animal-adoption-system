using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONG.Application.UseCases.Animals.CreateAnimal;
using ONG.Application.UseCases.Animals.ListAnimals;
using ONG.Application.UseCases.Animals.GetAnimalById;

namespace ONG.API.Controllers
{
    [ApiController]
    [Route("api/animals")]
    public class AnimalController : ControllerBase
    {
        private readonly GetAnimalByIdHandler _getByIdHandler;
        private readonly CreateAnimalHandler _handler;
        private readonly ListAnimalsHandler _listHandler;

        public AnimalController(
            CreateAnimalHandler handler, 
            ListAnimalsHandler listHandler,
            GetAnimalByIdHandler getByIdHandler)
        {
            _handler = handler;
            _listHandler = listHandler;
            _getByIdHandler = getByIdHandler;
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
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetById(Guid id)
        {
            var query = new GetAnimalByIdQuery
            {
                Id = id
            };

            var animal = _getByIdHandler.Handle(query);

            if (animal is null)
                return NotFound();

            return Ok(animal);
        }
    }
}

