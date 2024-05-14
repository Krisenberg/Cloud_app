using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;

namespace server
{
    public class JWTBearerConfigureOptions() : IConfigureNamedOptions<JwtBearerOptions>
    {

        public void Configure(string? name, JwtBearerOptions options)
        {
            var cognito_region = Environment.GetEnvironmentVariable("COGNITO_REGION");
            var cognito_user_pool_id = Environment.GetEnvironmentVariable("COGNITO_USER_POOL_ID");
            var authority = $"https://cognito-idp.{cognito_region}.amazonaws.com/{cognito_user_pool_id}";
            var metadataAddress = $"https://cognito-idp.{cognito_region}.amazonaws.com/{cognito_user_pool_id}/.well-known/openid-configuration";
            options.Authority = authority;
            options.MetadataAddress = metadataAddress;
            options.IncludeErrorDetails = true;
            options.RequireHttpsMetadata = false;
            options.TokenValidationParameters.ValidateIssuer = true;
            options.TokenValidationParameters.ValidateAudience = false;
            options.TokenValidationParameters.ValidateIssuerSigningKey = true;
        }

        public void Configure(JwtBearerOptions options)
        {
            throw new NotImplementedException();
        }
    }
}
