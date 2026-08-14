using ONG.Domain.Entitites;

namespace ONG.Domain.Entitites
{
    public class Animal
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public Sex Sex { get; set; }
        public Size Size { get; set; }
        public Species Species { get; set; }
        public int ApproximateAge { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public Status Status { get; set; }



        public Animal(
            string name,
            Species species,
            Sex sex,
            Size size,
            int approximateAge,
            string description,
            string image,
            Status status)
        {
            Name = name;
            Sex = sex;
            Size = size;
            ApproximateAge = approximateAge;
            Description = description;
            Image = image;
            Status = status;
        }
    }
}
