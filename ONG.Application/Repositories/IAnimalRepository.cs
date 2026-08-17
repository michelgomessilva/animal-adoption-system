using ONG.Domain.Entitites;

namespace ONG.Application.Repositories
{
    public interface IAnimalRepository
    {
        void Add(Animal animal);
        Animal? GetById(Guid id);
        void SaveChanges();
    }
}
