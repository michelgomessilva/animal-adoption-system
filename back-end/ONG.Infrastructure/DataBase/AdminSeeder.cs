using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace ONG.Infrastructure.DataBase
{
    public static class AdminSeeder
    {
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
