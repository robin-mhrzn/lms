using System.Security.Cryptography;
using System.Text;

namespace API.User.Shared
{
    public class PasswordHelper
    {
        public static string HashPassword(string password)
        {
            // Generate a salt
            using (var rng = new RNGCryptoServiceProvider())
            {
                byte[] salt = new byte[16]; // 128-bit salt
                rng.GetBytes(salt);

                // Hash the password using PBKDF2 with the salt
                using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000))
                {
                    byte[] hash = pbkdf2.GetBytes(20); // 160-bit hash

                    // Combine salt and hash for storage
                    byte[] hashBytes = new byte[36];
                    Array.Copy(salt, 0, hashBytes, 0, 16);
                    Array.Copy(hash, 0, hashBytes, 16, 20);

                    // Return the result as Base64 string
                    return Convert.ToBase64String(hashBytes);
                }
            }
        }

        public static bool VerifyPassword(string password, string storedHash)
        {
            byte[] hashBytes = Convert.FromBase64String(storedHash);

            // Extract the salt from the stored hash
            byte[] salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);

            // Hash the input password with the extracted salt
            using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000))
            {
                byte[] hash = pbkdf2.GetBytes(20); // 160-bit hash

                // Compare the computed hash with the stored hash
                for (int i = 0; i < 20; i++)
                {
                    if (hashBytes[i + 16] != hash[i])
                    {
                        return false;
                    }
                }
            }
            return true;
        }
    }

}
