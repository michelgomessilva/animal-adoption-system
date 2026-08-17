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

        [Fact]
        public void Rename_UpdatesUsernameOnly()
        {
            var admin = new Admin("fernanda", "hashed-value");
            var originalId = admin.Id;
            var originalCreatedAt = admin.CreatedAt;
            var originalHash = admin.PasswordHash;

            admin.Rename("nova-fernanda");

            Assert.Equal("nova-fernanda", admin.Username);
            Assert.Equal(originalId, admin.Id);
            Assert.Equal(originalCreatedAt, admin.CreatedAt);
            Assert.Equal(originalHash, admin.PasswordHash);
        }

        [Fact]
        public void RotatePassword_UpdatesPasswordHashOnly()
        {
            var admin = new Admin("fernanda", "hashed-value");
            var originalId = admin.Id;
            var originalCreatedAt = admin.CreatedAt;
            var originalUsername = admin.Username;

            admin.RotatePassword("new-hashed-value");

            Assert.Equal("new-hashed-value", admin.PasswordHash);
            Assert.Equal(originalId, admin.Id);
            Assert.Equal(originalCreatedAt, admin.CreatedAt);
            Assert.Equal(originalUsername, admin.Username);
        }
    }
}
