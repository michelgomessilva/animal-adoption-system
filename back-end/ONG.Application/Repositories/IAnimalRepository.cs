using ONG.Domain.Entitites;

namespace ONG.Application.Repositories
{
    public interface IAnimalRepository
    {
        void Add(Animal animal);
        void SaveChanges();
    }
}
