using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ONG.Domain.Entitites;
using ONG.Infrastructure.DataBase;
using System.Text.Json.Serialization;
using ONG.Application.Repositories;
using ONG.Application.Security;
using ONG.Application.UseCases.Animals.AdoptAnimal;
using ONG.Application.UseCases.Animals.CreateAnimal;
using ONG.Application.UseCases.Auth.Login;
using ONG.Infrastructure.Repositories;
using ONG.Infrastructure.Security;

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
builder.Services.AddScoped<AdoptAnimalHandler>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<ITokenGenerator, JwtTokenGenerator>();
builder.Services.Configure<PasswordHasherOptions>(
    builder.Configuration.GetSection("PasswordHasher"));
builder.Services.AddScoped<IPasswordHasher<Admin>, PasswordHasher<Admin>>();
builder.Services.AddScoped<LoginHandler>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    JwtTokenGenerator.ValidateConfiguration(builder.Configuration);
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

public partial class Program { }
