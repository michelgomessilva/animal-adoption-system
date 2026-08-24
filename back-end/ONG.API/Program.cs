using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using ONG.Domain.Entitites;
using ONG.Infrastructure.DataBase;
using System.Text;
using System.Text.Json.Serialization;
using ONG.Application.Repositories;
using ONG.Application.Security;
using ONG.Application.UseCases.Animals.CreateAnimal;
using ONG.Application.UseCases.Animals.ListAnimals;
using ONG.Application.UseCases.Auth.Login;
using ONG.Infrastructure.Repositories;
using ONG.Infrastructure.Security;
using ONG.API.Middleware;
using ONG.Application.UseCases.Animals.GetAnimalById;
using ONG.Application.UseCases.Animals.UpdateAnimal;

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
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = []
    });
});

builder.Services.AddScoped<IAnimalRepository, AnimalRepository>();
builder.Services.AddScoped< CreateAnimalHandler > ();
builder.Services.AddScoped<ListAnimalsHandler>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<ITokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<GetAnimalByIdHandler>();
builder.Services.AddScoped<UpdateAnimalHandler>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.Configure<PasswordHasherOptions>(
    builder.Configuration.GetSection("PasswordHasher"));
builder.Services.AddScoped<IPasswordHasher<Admin>, PasswordHasher<Admin>>();
builder.Services.AddScoped<LoginHandler>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    JwtTokenGenerator.ValidateConfiguration(builder.Configuration);

    var dbContext = scope.ServiceProvider.GetRequiredService<ONGDbContext>();
    // Guarded: the EF Core InMemory provider (used by WebApplicationFactory-based E2E
    // tests) doesn't implement the relational services Migrate() needs and throws if
    // called against it. Real deploys (Render, Docker, local host run) always use the
    // relational Npgsql provider, so this only ever skips in tests.
    if (dbContext.Database.IsRelational())
    {
        dbContext.Database.Migrate();
    }

    AdminSeeder.Seed(dbContext, builder.Configuration);
}

app.UseSwagger();
app.UseSwaggerUI();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }
