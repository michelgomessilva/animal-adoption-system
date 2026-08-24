using ONG.Application.Repositories;
using ONG.Domain.Entitites;

namespace ONG.Application.UseCases.Animals.UpdateAnimal
{
    public class UpdateAnimalHandler
    {
        private readonly IAnimalRepository _repository;

        public UpdateAnimalHandler(IAnimalRepository repository)
        {
            _repository = repository;
        }

        public Animal? Handle(UpdateAnimalCommand command)
        {
            var animal = _repository.GetById(command.Id);

            if (animal is null)
                return null;

            if (command.Species == Species.None)
                throw new ArgumentException("Species is required");

            if (command.Sex == Sex.None)
                throw new ArgumentException("Sex is required");

            if (command.Size == Size.None)
                throw new ArgumentException("Size is required");

            if (command.Status == Status.None)
                throw new ArgumentException("Status is required");

            animal.Update(
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

            _repository.SaveChanges();

            return animal;
        }

    }
}