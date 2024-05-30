using Amazon.S3;
using Microsoft.EntityFrameworkCore;
using CloudStorage;
using CloudStorage.Models;
using DotNetEnv;
using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

builder.Services.AddAuthorization();

// Loads the AWS Configuration from the appsettings.json into the application’s runtime
builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());

// Adds the S3 Service into the pipeline
builder.Services.AddAWSService<IAmazonS3>();

string? saPassword = Environment.GetEnvironmentVariable("MSSQL_SA_PASSWORD");
string? databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
var connectionString = builder.Configuration.GetConnectionString("FileStorageDb");

if (connectionString != null)
{
    connectionString = connectionString.Replace("<MSSQL_SA_PASSWORD>", saPassword);
    connectionString = connectionString.Replace("<DATABASE_URL>", databaseUrl);
}

builder.Services.AddDbContextPool<FileStorageDb>(options =>
    options.UseSqlServer(connectionString));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<FileStorageDb>();
    dbContext.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

//app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

//app.MapRazorPages();

app.MapGet("/test", () => "Example response - this endpoint is working!");

app.MapGet("/files", async (FileStorageDb db) =>
    await db.Files.ToListAsync());

app.MapPost("/files", async (FileEntry file, FileStorageDb db) =>
{
    db.Files.Add(file);
    await db.SaveChangesAsync();

    return Results.Created($"/files/{file.Id}", file);
});

app.MapPut("/files/{id}", async (int id, FileEntry newFileData, FileStorageDb db) =>
{
    var file = await db.Files.FindAsync(id);

    if (file is null) return Results.NotFound();

    file.FileName = newFileData.FileName;
    file.S3Url = newFileData.S3Url;

    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();
