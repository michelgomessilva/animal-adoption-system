using ONG.Application.Repositories;
using ONG.Domain.Entitites;

namespace ONG.Application.UseCases.Animals.CreateAnimal
{
    public class CreateAnimalHandler
    {
        private readonly IAnimalRepository _repository;
        public CreateAnimalHandler(IAnimalRepository repository)
        {
            _repository = repository;
        }
        public Animal Handle(CreateAnimalCommand command)
        {
            var animal = new Animal(
                command.Name,
                command.Species,
                command.Sex,
                command.Size,
                command.approximateAge,
                command.Description,
                command.Image,
                command.Status
                );

            _repository.Add(animal);
            _repository.SaveChanges();

            return animal;

        }
            
    }
}
