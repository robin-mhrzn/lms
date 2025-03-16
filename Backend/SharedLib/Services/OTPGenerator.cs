using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SharedLib.Services
{

    public class OTPGenerator
    {
        public  string GenerateOTP(int length = 6)
        {
            const string chars = "0123456789"; // Numeric OTP
            char[] otp = new char[length];
            using (var rng = new RNGCryptoServiceProvider())
            {
                byte[] randomData = new byte[length];
                rng.GetBytes(randomData);
                for (int i = 0; i < length; i++)
                {
                    otp[i] = chars[randomData[i] % chars.Length];
                }
            }
            return new string(otp);
        }
    }
}
