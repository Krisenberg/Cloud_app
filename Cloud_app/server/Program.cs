//using Microsoft.IdentityModel.Tokens;
using server.DataService;
using server.Hubs;
using System.Runtime.CompilerServices;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var allowedOrigin = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("reactFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigin)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials(); ;
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

app.UseHttpsRedirection();

//var game = new Game { User1ID = Guid.NewGuid(), User2ID = Guid.NewGuid(), GameState = "000000000" };
var users = new List<User>();

app.MapGet("/users", () =>
{
    return users;
});

app.MapPost("/signup", (UserData userData) =>
{
    User user = new User(userData.Username, userData.Password);
    users.Add(user);
    return Results.Ok(user);
});

app.MapHub<GameHub>("/game");
app.Run();

class UserData
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}

class User
{
    public Guid UserID { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }

    public User(string username, string password)
    {
        UserID = Guid.NewGuid();
        Username = username;
        Password = BCrypt.Net.BCrypt.EnhancedHashPassword(password);
    }

    public bool VerifyPassword(string providedPassword)
    {
        return BCrypt.Net.BCrypt.EnhancedVerify(providedPassword, Password);
    }

    public string CreateToken()
    {
        return UserID.ToString() + "&&&" + Username;
        //List<Claim> claims = new List<Claim>
        //{
        //    new Claim(ClaimTypes.Name, Username)
        //};

        //var key = new SymmetricSecurityKey();
    }

}