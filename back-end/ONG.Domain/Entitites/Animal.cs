using ONG.Domain.Entitites;

namespace ONG.Domain.Entitites
{
    public class Animal
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; } = string.Empty;
        public Sex Sex { get; private set; }
        public Size Size { get; private set; }
        public Species Species { get; private set; }
        public int ApproximateAge { get; private set; }
        public string Description { get; private set; } = string.Empty;
        public string Image { get; private set; } = string.Empty;
        public Status Status { get; private set; }
        public string District { get; private set; } = string.Empty;
        public string City { get; private set; } = string.Empty;
        public DateTime CreatedAt { get; private set; }
        public Animal(
            string name,
            Species species,
            Sex sex,
            Size size,
            int approximateAge,
            string description,
            string image,
            Status status,
            string district,
            string city)
        {
            Id = Guid.NewGuid();
            Name = name;
            Sex = sex;
            Size = size;
            ApproximateAge = approximateAge;
            Description = description;
            Image = image;
            CreatedAt = DateTime.UtcNow;
            Status = status;
            District = district;
            City = city;
        }
    }
}
