using ONG.Domain.Entitites;

namespace ONG.Application.Repositories
{
    public interface IAdminRepository
    {
        Admin? GetByUsername(string username);
    }
}
