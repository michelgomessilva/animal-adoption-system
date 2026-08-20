using System.Collections.Generic;
using System.Linq;
using ONG.Application.Repositories;
using ONG.Domain.Entitites;

namespace ONG.Application.UseCases.Animals.ListAnimals
{
    public class ListAnimalsHandler
    {
        private readonly IAnimalRepository _repository;

        public ListAnimalsHandler(IAnimalRepository repository)
        {
            _repository = repository;
        }

        public List<Animal> Handle(ListAnimalsCommand command)
        {
            var animals = _repository.GetAll(new AnimalFilter());

            return command.IsAuthenticated
                ? animals
                : animals.Where(a => a.Status == Status.Available).ToList();
        }
    }
}
