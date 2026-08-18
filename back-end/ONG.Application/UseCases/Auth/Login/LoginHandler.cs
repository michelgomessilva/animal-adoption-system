using Microsoft.AspNetCore.Identity;
using ONG.Application.Repositories;
using ONG.Application.Security;
using ONG.Domain.Entitites;

namespace ONG.Application.UseCases.Auth.Login
{
    public class LoginHandler
    {
        // Verified against on an unknown username so that Handle takes roughly the same
        // time on both the "unknown username" and "wrong password" failure paths — without
        // this, an attacker could distinguish valid from invalid usernames purely from
        // response time (the hasher is deliberately slow; skipping it on an unknown
        // username would make that path return noticeably faster).
        private static readonly Admin DummyAdminForTimingNormalization = new("dummy-user", string.Empty);

        private readonly IAdminRepository _repository;
        private readonly ITokenGenerator _tokenGenerator;
        private readonly IPasswordHasher<Admin> _passwordHasher;

        public LoginHandler(
            IAdminRepository repository, ITokenGenerator tokenGenerator, IPasswordHasher<Admin> passwordHasher)
        {
            _repository = repository;
            _tokenGenerator = tokenGenerator;
            _passwordHasher = passwordHasher;
        }

        public LoginResult? Handle(LoginCommand command)
        {
            var admin = _repository.GetByUsername(command.Username);

            if (admin is null)
            {
                // Result is discarded: this call exists purely to normalize timing, not to
                // authenticate the dummy admin. Hashing (rather than verifying a fixed
                // precomputed hash) costs one PBKDF2 derivation under the same injected,
                // configured iteration count as the real VerifyHashedPassword call below —
                // so it stays timing-equivalent regardless of how PasswordHasher:IterationCount
                // is configured.
                _passwordHasher.HashPassword(DummyAdminForTimingNormalization, command.Password);
                return null;
            }

            var verification = _passwordHasher.VerifyHashedPassword(admin, admin.PasswordHash, command.Password);
            if (verification == PasswordVerificationResult.Failed)
            {
                return null;
            }

            var token = _tokenGenerator.GenerateToken(admin);
            return new LoginResult(token);
        }
    }
}
