using Microsoft.AspNetCore.Identity;
using ONG.Application.Repositories;
using ONG.Application.Security;
using ONG.Domain.Entitites;

namespace ONG.Application.UseCases.Auth.Login
{
    public class LoginHandler
    {
        private readonly IAdminRepository _repository;
        private readonly ITokenGenerator _tokenGenerator;

        public LoginHandler(IAdminRepository repository, ITokenGenerator tokenGenerator)
        {
            _repository = repository;
            _tokenGenerator = tokenGenerator;
        }

        public LoginResult? Handle(LoginCommand command)
        {
            var admin = _repository.GetByUsername(command.Username);
            if (admin is null)
            {
                return null;
            }

            var hasher = new PasswordHasher<Admin>();
            var verification = hasher.VerifyHashedPassword(admin, admin.PasswordHash, command.Password);
            if (verification == PasswordVerificationResult.Failed)
            {
                return null;
            }

            var token = _tokenGenerator.GenerateToken(admin);
            return new LoginResult(token);
        }
    }
}
