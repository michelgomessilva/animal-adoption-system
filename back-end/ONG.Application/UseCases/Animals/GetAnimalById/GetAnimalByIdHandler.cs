using ONG.Application.Repositories;
using ONG.Domain.Entitites;

namespace ONG.Application.UseCases.Animals.GetAnimalById
{
    public class GetAnimalByIdHandler
    {
        private readonly IAnimalRepository _repository;

        public GetAnimalByIdHandler(IAnimalRepository repository)
        {
            _repository = repository;
        }

        public Animal? Handle(GetAnimalByIdQuery query)
        {
            return _repository.GetById(query.Id);
        }
    }
}
