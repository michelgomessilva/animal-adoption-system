using System;
using Microsoft.EntityFrameworkCore;
using ONG.Domain.Entitites;
using ONG.Infrastructure.DataBase;
using ONG.Infrastructure.Repositories;
using Xunit;

namespace ONG.Tests.Infrastructure
{
    public class AdminRepositoryTests
    {
        private static ONGDbContext CreateContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<ONGDbContext>()
                .UseInMemoryDatabase(dbName)
                .Options;
            return new ONGDbContext(options);
        }

        [Fact]
        public void GetByUsername_ExistingUsername_ReturnsMatchingAdmin()
        {
            var dbName = Guid.NewGuid().ToString();
            using var context = CreateContext(dbName);
            context.Admins.Add(new Admin("outro-admin", "other-hash"));
            var target = new Admin("fernanda", "hashed-value");
            context.Admins.Add(target);
            context.SaveChanges();

            var repository = new AdminRepository(context);
            var result = repository.GetByUsername("fernanda");

            Assert.NotNull(result);
            Assert.Equal(target.Id, result!.Id);
        }

        [Fact]
        public void GetByUsername_UnknownUsername_ReturnsNull()
        {
            var dbName = Guid.NewGuid().ToString();
            using var context = CreateContext(dbName);
            context.Admins.Add(new Admin("fernanda", "hashed-value"));
            context.SaveChanges();

            var repository = new AdminRepository(context);
            var result = repository.GetByUsername("does-not-exist");

            Assert.Null(result);
        }
    }
}
