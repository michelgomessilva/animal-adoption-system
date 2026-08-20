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
        public List<Animal> GetAll(AnimalFilter filter)
        {
            IQueryable<Animal> query = _context.Animals;

            if (filter.Species.HasValue)
                query = query.Where(a => a.Species == filter.Species.Value);

            if (filter.Sex.HasValue)
                query = query.Where(a => a.Sex == filter.Sex.Value);

            if (filter.Size.HasValue)
                query = query.Where(a => a.Size == filter.Size.Value);

            if (filter.Status.HasValue)
                query = query.Where(a => a.Status == filter.Status.Value);

            if (!string.IsNullOrEmpty(filter.District))
                query = query.Where(a => a.District.ToLower() == filter.District.ToLower());

            if (!string.IsNullOrEmpty(filter.City))
                query = query.Where(a => a.City.ToLower() == filter.City.ToLower());

            if (filter.OrderBy.HasValue)
            {
                query = filter.OrderBy.Value switch
                {
                    AnimalSortField.Name => filter.OrderDescending
                        ? query.OrderByDescending(a => a.Name)
                        : query.OrderBy(a => a.Name),
                    AnimalSortField.Species => filter.OrderDescending
                        ? query.OrderByDescending(a => a.Species)
                        : query.OrderBy(a => a.Species),
                    AnimalSortField.Size => filter.OrderDescending
                        ? query.OrderByDescending(a => a.Size)
                        : query.OrderBy(a => a.Size),
                    AnimalSortField.CreatedAt => filter.OrderDescending
                        ? query.OrderByDescending(a => a.CreatedAt)
                        : query.OrderBy(a => a.CreatedAt),
                    _ => query
                };
            }

            return query.ToList();
        }
    }
}
