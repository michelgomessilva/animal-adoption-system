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
            if (command.Species == Species.None)
                throw new ArgumentException("Species is required");

            if (command.Sex == Sex.None)
                throw new ArgumentException("Sex is required");

            if (command.Size == Size.None)
                throw new ArgumentException("Size is required");

            if (command.Status == Status.None)
                throw new ArgumentException("Status is required");


            var animal = new Animal(
                command.Name,
                command.Species,
                command.Sex,
                command.Size,
                command.approximateAge,
                command.Description,
                command.Image,
                command.Status,
                command.District,
                command.City
                );

            _repository.Add(animal);
            _repository.SaveChanges();

            return animal;

        }
            
    }
}
