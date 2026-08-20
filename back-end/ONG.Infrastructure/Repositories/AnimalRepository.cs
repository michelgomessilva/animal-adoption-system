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
        public void SaveChanges()
        {
            _context.SaveChanges();
        }
        public List<Animal> GetAll()
        {
            return _context.Animals.ToList();
        }
    }
}
