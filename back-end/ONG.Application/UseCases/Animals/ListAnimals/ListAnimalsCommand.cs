namespace ONG.Application.UseCases.Animals.ListAnimals
{
    public class ListAnimalsCommand
    {
        public bool IsAuthenticated { get; set; }
        public string? Species { get; set; }
        public string? Sex { get; set; }
        public string? Size { get; set; }
        public string? Status { get; set; }
        public string? District { get; set; }
        public string? City { get; set; }
    }
}
