using Microsoft.EntityFrameworkCore;
using ONG.Domain.Entitites;

namespace ONG.Infrastructure.DataBase
{
    public class ONGDbContext:DbContext
    {
        public ONGDbContext(DbContextOptions<ONGDbContext> options)
            : base(options)
        {
        }

        public DbSet<Animal> Animals { get; set; }
    }
}
