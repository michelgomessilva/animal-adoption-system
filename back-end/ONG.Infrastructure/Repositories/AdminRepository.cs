using System.Linq;
using ONG.Application.Repositories;
using ONG.Domain.Entitites;
using ONG.Infrastructure.DataBase;

namespace ONG.Infrastructure.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ONGDbContext _context;

        public AdminRepository(ONGDbContext context)
        {
            _context = context;
        }

        public Admin? GetByUsername(string username)
        {
            return _context.Admins.FirstOrDefault(admin => admin.Username == username);
        }
    }
}
