using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using ONG.Domain.Entitites;

namespace ONG.Infrastructure.DataBase
{
    public static class AdminSeeder
    {
        public static void Seed(ONGDbContext context, IConfiguration configuration)
        {
            ValidateConfiguration(configuration);

            var username = configuration["AdminSeed:Username"]!;
            var password = configuration["AdminSeed:Password"]!;
            var hasher = new PasswordHasher<Admin>();

            var admin = context.Admins.OrderBy(a => a.CreatedAt).FirstOrDefault();

            if (admin is null)
            {
                var newAdmin = new Admin(username, passwordHash: string.Empty);
                newAdmin.RotatePassword(hasher.HashPassword(newAdmin, password));
                context.Admins.Add(newAdmin);
                context.SaveChanges();
                return;
            }

            var changed = false;

            if (!string.Equals(admin.Username, username, StringComparison.Ordinal))
            {
                admin.Rename(username);
                changed = true;
            }

            var verification = hasher.VerifyHashedPassword(admin, admin.PasswordHash, password);
            if (verification != PasswordVerificationResult.Success)
            {
                admin.RotatePassword(hasher.HashPassword(admin, password));
                changed = true;
            }

            if (changed)
            {
                context.SaveChanges();
            }
        }

        public static void ValidateConfiguration(IConfiguration configuration)
        {
            var missing = new List<string>();

            if (string.IsNullOrWhiteSpace(configuration["AdminSeed:Username"]))
            {
                missing.Add("AdminSeed:Username");
            }

            if (string.IsNullOrWhiteSpace(configuration["AdminSeed:Password"]))
            {
                missing.Add("AdminSeed:Password");
            }

            if (missing.Count > 0)
            {
                throw new InvalidOperationException(
                    $"Missing required configuration key(s): {string.Join(", ", missing)}. " +
                    "These provision the only account able to authenticate; the application " +
                    "cannot start without them.");
            }
        }
    }
}
