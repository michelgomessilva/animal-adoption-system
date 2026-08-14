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
        public Animal Handle(CreateAnimalRequest request)
        {
            var animal = new Animal(
                request.Name,
                request.Species,
                request.Sex,
                request.Size,
                request.approximateAge,
                request.Description,
                request.Image,
                request.Status
                );

            _repository.Add(animal);
            _repository.SaveChanges();

            return animal;

        }
            
    }
}
