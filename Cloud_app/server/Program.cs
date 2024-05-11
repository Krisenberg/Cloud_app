//using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using server;
using server.DataService;
using server.Hubs;
using System.Runtime.CompilerServices;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer();
builder.Services.ConfigureOptions<JWTBearerConfigureOptions>();

var allowedOrigin = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

DotNetEnv.Env.Load();

// Add services to the container.
builder.Services.AddCors(options =>
{
    // options.AddPolicy("test", policy =>
    //     policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader().AllowCredentials());
    options.AddPolicy("reactFrontend", policy =>
    {
        // policy.WithOrigins(allowedOrigin)
        //         .AllowAnyHeader()
        //         .AllowAnyMethod()
        //         .AllowCredentials();
        string frontend_ip = Environment.GetEnvironmentVariable("FRONTEND_IP") ?? "http://localhost:3000";
        policy.WithOrigins(frontend_ip)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
    });
});

builder.Services.AddSingleton<GameDb>();

var app = builder.Build();

app.UseCors("reactFrontend");

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseSwagger();
//app.UseSwaggerUI();

//app.UseHttpsRedirection();

var users = new List<Test>();
users.Add(new Test("Krzysztof Glowacz", DateTime.Now));

app.MapGet("/test", () =>
{
    return users;
});

app.MapHub<GameHub>("/game")
    .RequireAuthorization();

app.UseAuthentication();
app.UseAuthorization();

app.Run();

class Test
{
    public Guid ID { get; set; }
    public string Author { get; set; }
    public string Date { get; set; }

    public Test(string author, DateTime date)
    {
        ID = Guid.NewGuid();
        Author = author;
        Date = date.ToString();
    }

}
