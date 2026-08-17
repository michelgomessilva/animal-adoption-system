using System;
using ONG.Domain.Entitites;
using Xunit;

namespace ONG.Tests.Domain
{
    public class AdminTests
    {
        [Fact]
        public void Constructor_SetsUsernamePasswordHashIdCreatedAtAndUpdatedAt()
        {
            var before = DateTime.UtcNow;

            var admin = new Admin("fernanda", "hashed-value");

            var after = DateTime.UtcNow;

            Assert.Equal("fernanda", admin.Username);
            Assert.Equal("hashed-value", admin.PasswordHash);
            Assert.NotEqual(Guid.Empty, admin.Id);
            Assert.InRange(admin.CreatedAt, before, after);
            Assert.Equal(admin.CreatedAt, admin.UpdatedAt);
        }

        [Fact]
        public void Rename_UpdatesUsernameAndUpdatedAt_LeavesCreatedAtUnchanged()
        {
            var admin = new Admin("fernanda", "hashed-value");
            var originalId = admin.Id;
            var originalCreatedAt = admin.CreatedAt;
            var originalHash = admin.PasswordHash;
            var originalUpdatedAt = admin.UpdatedAt;

            admin.Rename("nova-fernanda");

            Assert.Equal("nova-fernanda", admin.Username);
            Assert.Equal(originalId, admin.Id);
            Assert.Equal(originalCreatedAt, admin.CreatedAt);
            Assert.Equal(originalHash, admin.PasswordHash);
            Assert.NotEqual(originalUpdatedAt, admin.UpdatedAt);
            Assert.True(admin.UpdatedAt >= originalUpdatedAt);
        }

        [Fact]
        public void RotatePassword_UpdatesPasswordHashAndUpdatedAt_LeavesCreatedAtUnchanged()
        {
            var admin = new Admin("fernanda", "hashed-value");
            var originalId = admin.Id;
            var originalCreatedAt = admin.CreatedAt;
            var originalUsername = admin.Username;
            var originalUpdatedAt = admin.UpdatedAt;

            admin.RotatePassword("new-hashed-value");

            Assert.Equal("new-hashed-value", admin.PasswordHash);
            Assert.Equal(originalId, admin.Id);
            Assert.Equal(originalCreatedAt, admin.CreatedAt);
            Assert.Equal(originalUsername, admin.Username);
            Assert.NotEqual(originalUpdatedAt, admin.UpdatedAt);
            Assert.True(admin.UpdatedAt >= originalUpdatedAt);
        }
    }
}
