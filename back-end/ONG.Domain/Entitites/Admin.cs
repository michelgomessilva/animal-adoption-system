using System;

namespace ONG.Domain.Entitites
{
    public class Admin
    {
        public Guid Id { get; private set; }
        public string Username { get; private set; } = string.Empty;
        public string PasswordHash { get; private set; } = string.Empty;
        public DateTime CreatedAt { get; private set; }

        public Admin(string username, string passwordHash)
        {
            Id = Guid.NewGuid();
            Username = username;
            PasswordHash = passwordHash;
            CreatedAt = DateTime.UtcNow;
        }

        public void Rename(string newUsername)
        {
            Username = newUsername;
        }

        public void RotatePassword(string newPasswordHash)
        {
            PasswordHash = newPasswordHash;
        }
    }
}
