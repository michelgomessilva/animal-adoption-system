using ONG.Application.Repositories;
using ONG.Domain.Entitites;
using ONG.Infrastructure.DataBase;

namespace ONG.Infrastructure.Repositories
{
    public class AnimalRepository : IAnimalRepository
    {
        private readonly ONGDbContext _context;

        public AnimalRepository(ONGDbContext context)
        {
            _context = context;
        }
        public void Add(Animal animal)
        {
            _context.Animals.Add(animal);
        }

        public Animal? GetById(Guid id)
        {
            return _context.Animals.FirstOrDefault(animal => animal.Id ==id);
        }
        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}
