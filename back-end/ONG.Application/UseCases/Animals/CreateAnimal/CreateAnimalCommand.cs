using System.ComponentModel.DataAnnotations;
using ONG.Domain.Entitites;

namespace ONG.Application.UseCases.Animals.CreateAnimal
{
    public class CreateAnimalCommand
    {
        [Required]
        [StringLength(20)]
        public string Name { get; set; } = string.Empty;
        public Species Species { get; set; }

        public Sex Sex { get; set; }
        public Size Size { get; set; }

        [Required]
        [StringLength(200)]
        public string Description { get; set; } = string.Empty;
        [Range(0, 30)]
        public int approximateAge { get; set; }
        public string Image { get; set; } = string.Empty;
        public Status Status { get; set; }

        [Required]
        [StringLength(30)]
        public string District { get; set; } = string.Empty;

        [Required]
        [StringLength(30)]
        public string City { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Parish { get; set; } = string.Empty;
    }
}
