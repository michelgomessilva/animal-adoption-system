using System;
using ONG.Domain.Entitites;
using Xunit;

namespace ONG.Tests.Domain
{
    public class AdminTests
    {
        [Fact]
        public void Constructor_SetsUsernamePasswordHashIdAndCreatedAt()
        {
            var before = DateTime.UtcNow;

            var admin = new Admin("fernanda", "hashed-value");

            var after = DateTime.UtcNow;

            Assert.Equal("fernanda", admin.Username);
            Assert.Equal("hashed-value", admin.PasswordHash);
            Assert.NotEqual(Guid.Empty, admin.Id);
            Assert.InRange(admin.CreatedAt, before, after);
        }
    }
}
