using ONG.Application.Repositories;
using ONG.Domain.Entitites;

namespace ONG.Application.UseCases.Animals.AdoptAnimal
{
    public class AdoptAnimalHandler
    {
        private readonly IAnimalRepository _repository;

        public AdoptAnimalHandler(IAnimalRepository repository)
        {
            _repository = repository;
        }

        public Animal Handle(AdoptAnimalCommand command)
        {
            var animal = _repository.GetById(command.AnimalId);

            if (animal is null)
                throw new Exception("Animal not found.");

            animal.Adopt();

            _repository.SaveChanges();

            return animal;
        }
    }
}