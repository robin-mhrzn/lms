using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.User.Model.AppSetting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace API.User.Shared
{
    public class JwtHelper
    {
        private readonly JwtConfigSetting _jwtSettings;

        public JwtHelper(IOptions<JwtConfigSetting> jwtSettings)
        {
            _jwtSettings = jwtSettings.Value;
        }

        public string GenerateToken(int userId, string userEmail, string role)
        {


            if (string.IsNullOrEmpty(_jwtSettings.SecretKey) || string.IsNullOrEmpty(_jwtSettings.Issuer) || string.IsNullOrEmpty(_jwtSettings.Audience))
            {
                throw new InvalidOperationException("JWT settings are not configured properly.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()), // User ID
            new Claim(JwtRegisteredClaimNames.Email, userEmail),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Unique Token ID
        };

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

}
