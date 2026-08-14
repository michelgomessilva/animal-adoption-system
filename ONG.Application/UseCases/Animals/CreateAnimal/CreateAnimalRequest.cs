using ONG.Domain.Entitites;

namespace ONG.Application.UseCases.Animals.CreateAnimal
{
    public class CreateAnimalRequest
    {
        public string Name { get; set; } = string.Empty;
        public Species Species { get; set; }

        public Sex Sex { get; set; }
        public Size Size { get; set; }
        public string Description { get; set; } = string.Empty;
        public int approximateAge { get; set; }
        public string Image { get; set; } = string.Empty;
        public Status Status { get; set; }

    }
}
