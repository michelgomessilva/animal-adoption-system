using Microsoft.EntityFrameworkCore;
using ONG.Domain.Entitites;

namespace ONG.Infrastructure.DataBase
{
    public class ONGDbContext : DbContext
    {
        public ONGDbContext(DbContextOptions<ONGDbContext> options)
            : base(options)
        {
        }

        public DbSet<Animal> Animals { get; set; }
        public DbSet<Admin> Admins { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Admin>()
                .HasIndex(a => a.Username)
                .IsUnique();
        }
    }
}
