using System.Security.Cryptography;
namespace SharedLib.Services
{
    public class OTPGenerator
    {
        public string GenerateOTP(int length = 6)
        {
            const string chars = "0123456789"; // Numeric OTP  
            char[] otp = new char[length];
            byte[] randomData = new byte[length];
            RandomNumberGenerator.Fill(randomData);
            for (int i = 0; i < length; i++)
            {
                otp[i] = chars[randomData[i] % chars.Length];
            }

            return new string(otp);
        }
    }
}
