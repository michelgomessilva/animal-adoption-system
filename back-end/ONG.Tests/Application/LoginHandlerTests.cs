using Microsoft.AspNetCore.Identity;
using ONG.Application.Repositories;
using ONG.Application.Security;
using ONG.Application.UseCases.Auth.Login;
using ONG.Domain.Entitites;
using Xunit;

namespace ONG.Tests.Application
{
    public class LoginHandlerTests
    {
        private class FakeAdminRepository : IAdminRepository
        {
            private readonly Admin? _admin;

            public FakeAdminRepository(Admin? admin)
            {
                _admin = admin;
            }

            public Admin? GetByUsername(string username) => _admin;
        }

        private class FakeTokenGenerator : ITokenGenerator
        {
            private readonly string _token;
            public bool WasCalled { get; private set; }

            public FakeTokenGenerator(string token)
            {
                _token = token;
            }

            public string GenerateToken(Admin admin)
            {
                WasCalled = true;
                return _token;
            }
        }

        [Fact]
        public void Handle_ValidCredentials_ReturnsResultWithToken()
        {
            var passwordHasher = new PasswordHasher<Admin>();
            var admin = new Admin("fernanda", string.Empty);
            admin.RotatePassword(passwordHasher.HashPassword(admin, "S3nhaForte!"));

            var repository = new FakeAdminRepository(admin);
            var tokenGenerator = new FakeTokenGenerator("known-token-value");
            var handler = new LoginHandler(repository, tokenGenerator, passwordHasher);

            var result = handler.Handle(new LoginCommand
            {
                Username = "fernanda",
                Password = "S3nhaForte!"
            });

            Assert.NotNull(result);
            Assert.Equal("known-token-value", result!.Token);
            Assert.True(tokenGenerator.WasCalled);
        }

        [Fact]
        public void Handle_UnknownUsername_ReturnsNull()
        {
            var repository = new FakeAdminRepository(null);
            var tokenGenerator = new FakeTokenGenerator("known-token-value");
            var passwordHasher = new PasswordHasher<Admin>();
            var handler = new LoginHandler(repository, tokenGenerator, passwordHasher);

            var result = handler.Handle(new LoginCommand
            {
                Username = "does-not-exist",
                Password = "whatever"
            });

            Assert.Null(result);
            Assert.False(tokenGenerator.WasCalled);
        }

        [Fact]
        public void Handle_WrongPassword_ReturnsNull()
        {
            var passwordHasher = new PasswordHasher<Admin>();
            var admin = new Admin("fernanda", string.Empty);
            admin.RotatePassword(passwordHasher.HashPassword(admin, "S3nhaForte!"));

            var repository = new FakeAdminRepository(admin);
            var tokenGenerator = new FakeTokenGenerator("known-token-value");
            var handler = new LoginHandler(repository, tokenGenerator, passwordHasher);

            var result = handler.Handle(new LoginCommand
            {
                Username = "fernanda",
                Password = "wrong-password"
            });

            Assert.Null(result);
        }
    }
}
