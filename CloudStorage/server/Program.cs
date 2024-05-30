using Amazon.S3;
using Microsoft.EntityFrameworkCore;
using CloudStorage;
using CloudStorage.Models;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

builder.Services.AddAuthorization();

// Loads the AWS Configuration from the appsettings.json into the application’s runtime
builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());

// Adds the S3 Service into the pipeline
builder.Services.AddAWSService<IAmazonS3>();

string? saPassword = Environment.GetEnvironmentVariable("MSSQL_SA_PASSWORD");
var connectionString = builder.Configuration.GetConnectionString("FileStorageDb");

if (connectionString != null)
    connectionString = connectionString.Replace("<MSSQL_SA_PASSWORD>", saPassword);

builder.Services.AddDbContextPool<FileStorageDb>(options =>
    options.UseSqlServer(connectionString));

var app = builder.Build();

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

app.MapGet("/files", async (FileStorageDb db) =>
    await db.Files.ToListAsync());

app.MapPost("/todoitems", async (FileEntry file, FileStorageDb db) =>
{
    db.Files.Add(file);
    await db.SaveChangesAsync();

    return Results.Created($"/fileentries/{file.Id}", file);
});

app.MapPut("/todoitems/{id}", async (int id, FileEntry newFileData, FileStorageDb db) =>
{
    var file = await db.Files.FindAsync(id);

    if (file is null) return Results.NotFound();

    file.FileName = newFileData.FileName;
    file.S3Url = newFileData.S3Url;

    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();
