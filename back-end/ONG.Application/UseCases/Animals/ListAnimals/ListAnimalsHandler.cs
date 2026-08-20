using System;
using System.Collections.Generic;
using ONG.Application.Repositories;
using ONG.Domain.Entitites;

namespace ONG.Application.UseCases.Animals.ListAnimals
{
    public class ListAnimalsHandler
    {
        private readonly IAnimalRepository _repository;

        public ListAnimalsHandler(IAnimalRepository repository)
        {
            _repository = repository;
        }

        public List<Animal> Handle(ListAnimalsCommand command)
        {
            var filter = new AnimalFilter
            {
                Species = ParseFilterEnum<Species>(command.Species, nameof(command.Species)),
                Sex = ParseFilterEnum<Sex>(command.Sex, nameof(command.Sex)),
                Size = ParseFilterEnum<Size>(command.Size, nameof(command.Size)),
                Status = ParseFilterEnum<Status>(command.Status, nameof(command.Status)),
                District = string.IsNullOrWhiteSpace(command.District) ? null : command.District.Trim(),
                City = string.IsNullOrWhiteSpace(command.City) ? null : command.City.Trim()
            };

            if (filter.Species == Species.None)
                throw new ArgumentException($"{nameof(command.Species)} filter value 'None' is not a valid filter");

            ApplyOrderBy(command.OrderBy, filter);

            if (!command.IsAuthenticated)
                filter.Status = Status.Available;

            return _repository.GetAll(filter);
        }

        private static TEnum? ParseFilterEnum<TEnum>(string? rawValue, string fieldName)
            where TEnum : struct, Enum
        {
            if (string.IsNullOrWhiteSpace(rawValue))
                return null;

            if (!Enum.TryParse<TEnum>(rawValue, ignoreCase: true, out var parsed))
                throw new ArgumentException($"{fieldName} filter value '{rawValue}' is not recognized");

            return parsed;
        }

        private static void ApplyOrderBy(string? rawOrderBy, AnimalFilter filter)
        {
            if (string.IsNullOrWhiteSpace(rawOrderBy))
                return;

            const string descendingSuffix = "_desc";
            var descending = rawOrderBy.EndsWith(descendingSuffix, StringComparison.OrdinalIgnoreCase);
            var fieldToken = descending
                ? rawOrderBy[..^descendingSuffix.Length]
                : rawOrderBy;

            if (!Enum.TryParse<AnimalSortField>(fieldToken, ignoreCase: true, out var field))
                throw new ArgumentException($"orderBy value '{rawOrderBy}' is not recognized");

            filter.OrderBy = field;
            filter.OrderDescending = descending;
        }
    }
}
