using ONG.Domain.Entitites;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json.Serialization;

namespace ONG.Application.UseCases.Animals.UpdateAnimal
{
    public class UpdateAnimalCommand
    {
        [JsonIgnore]
        public Guid Id { get; set; }

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
    }
}
