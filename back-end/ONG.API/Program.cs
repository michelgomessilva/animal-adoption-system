using Microsoft.EntityFrameworkCore;
using ONG.Infrastructure.DataBase;
using System.Text.Json.Serialization;
using ONG.Application.Repositories;
using ONG.Application.UseCases.Animals.CreateAnimal;
using ONG.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
     {
         options.JsonSerializerOptions.Converters.Add(
             new JsonStringEnumConverter());
     });

builder.Services.AddDbContext<ONGDbContext>(options =>
options.UseNpgsql(
    builder.Configuration.GetConnectionString("DefaultConnection")));
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi(); 
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IAnimalRepository, AnimalRepository>();
builder.Services.AddScoped< CreateAnimalHandler > ();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    AdminSeeder.Seed(scope.ServiceProvider.GetRequiredService<ONGDbContext>(), builder.Configuration);
}

app.UseSwagger();
app.UseSwaggerUI();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
