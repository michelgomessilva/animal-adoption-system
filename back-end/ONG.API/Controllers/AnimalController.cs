using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONG.Application.UseCases.Animals.CreateAnimal;
using ONG.Application.UseCases.Animals.GetAnimalById;
using ONG.Application.UseCases.Animals.ListAnimals;
using ONG.Application.UseCases.Animals.UpdateAnimal;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace ONG.API.Controllers
{
    [ApiController]
    [Route("api/animals")]
    public class AnimalController : ControllerBase
    {
        private readonly GetAnimalByIdHandler _getByIdHandler;
        private readonly CreateAnimalHandler _handler;
        private readonly ListAnimalsHandler _listHandler;
        private readonly UpdateAnimalHandler _updateHandler;

        public AnimalController(
            CreateAnimalHandler handler,
            ListAnimalsHandler listHandler,
            GetAnimalByIdHandler getByIdHandler,
            UpdateAnimalHandler updateHandler)
        {
            _handler = handler;
            _listHandler = listHandler;
            _getByIdHandler = getByIdHandler;
            _updateHandler = updateHandler;
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
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public IActionResult GetById(Guid id)
        {
            var query = new GetAnimalByIdQuery
            {
                Id = id
            };

            var animal = _getByIdHandler.Handle(query);

            if (animal is null)
                return Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Animal not found.",
                    detail: $"No animal found with id '{id}'.");

            return Ok(animal);
        }
        [Authorize]
        [HttpPut("{id}")]
        public IActionResult Update(Guid id, UpdateAnimalCommand command)
        {
            command.Id = id;

            var animal = _updateHandler.Handle(command);

            if (animal is null)
                return Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Animal not found.",
                    detail: $"No animal found with id '{id}'.");

            return Ok(animal);
        }
    }
}

