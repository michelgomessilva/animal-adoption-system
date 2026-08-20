using ONG.Domain.Entitites;

namespace ONG.Application.Repositories
{
    public class AnimalFilter
    {
        public Species? Species { get; set; }
        public Sex? Sex { get; set; }
        public Size? Size { get; set; }
        public Status? Status { get; set; }
        public string? District { get; set; }
        public string? City { get; set; }
        public AnimalSortField? OrderBy { get; set; }
        public bool OrderDescending { get; set; }
    }
}
