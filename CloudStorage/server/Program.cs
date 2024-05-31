using Amazon.S3;
using Microsoft.EntityFrameworkCore;
using CloudStorage;
using CloudStorage.Models;
using DotNetEnv;
using Microsoft.AspNetCore.Builder;
using Amazon.Extensions.NETCore.Setup;
using Amazon.Runtime;
using Amazon.S3.Model;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

builder.Services.AddAuthorization();

//string? awsAccessKeyId = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID");
//string? awsSecretAccessKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY");
//string? awsRegion = Environment.GetEnvironmentVariable("AWS_REGION") ?? "us-east-1";
//string? s3Bucket = Environment.GetEnvironmentVariable("S3_BUCKET");
string? awsAccessKeyId = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID");
string? awsSecretAccessKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY");
string? awsSessionToken = Environment.GetEnvironmentVariable("AWS_SESSION_TOKEN");
string awsRegion = Environment.GetEnvironmentVariable("AWS_REGION") ?? "us-east-1";
string? s3Bucket = Environment.GetEnvironmentVariable("S3_BUCKET");

if (string.IsNullOrEmpty(awsAccessKeyId) || string.IsNullOrEmpty(awsSecretAccessKey) || 
    string.IsNullOrEmpty(awsSessionToken) || string.IsNullOrEmpty(s3Bucket))
{
    throw new InvalidOperationException("Not all the environment variables have been set.");
}

//AWSOptions awsOptions = builder.Configuration.GetAWSOptions();
//awsOptions.Credentials = new BasicAWSCredentials(awsAccessKeyId, awsSecretAccessKey);
//awsOptions.Region = Amazon.RegionEndpoint.GetBySystemName(awsRegion);

//var awsCredentials = new BasicAWSCredentials(awsAccessKeyId, awsSecretAccessKey);

//// Create AWS options
//var awsOptions = new AWSOptions
//{
//    Credentials = awsCredentials,
//    Region = Amazon.RegionEndpoint.GetBySystemName(awsRegion)
//};

//builder.Services.AddDefaultAWSOptions(awsOptions);

builder.Services.AddSingleton<IAmazonS3>(serviceProvider =>
{
    // Create and configure your custom AmazonS3Client instance
    AmazonS3Client s3Client = new AmazonS3Client(
        credentials: new SessionAWSCredentials(
            awsAccessKeyId: awsAccessKeyId,
            awsSecretAccessKey: awsSecretAccessKey,
            token: awsSessionToken
        ),
        region: Amazon.RegionEndpoint.GetBySystemName(awsRegion)
    );

    // Return the configured AmazonS3Client instance
    return s3Client;
});


// Loads the AWS Configuration from the appsettings.json into the application�s runtime
//builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());

// Adds the S3 Service into the pipeline
//builder.Services.AddAWSService<IAmazonS3>(
//    new AmazonS3Client(
//        credentials: new SessionAWSCredentials(
//            awsAccessKeyId: awsAccessKeyId,
//            awsSecretAccessKey: awsSecretAccessKey,
//            token: awsSessionToken
//        ),
//        region: Amazon.RegionEndpoint.GetBySystemName(awsRegion)
//);

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

app.MapGet("/api/files", async (FileStorageDb db) =>
    await db.Files.ToListAsync());

//app.MapPost("/api/files", async (FileEntry file, FileStorageDb db) =>
//{
//    db.Files.Add(file);
//    await db.SaveChangesAsync();

//    return Results.Created($"/files/{file.Id}", file);
//});

app.MapPost("/api/files", async (IFormFile file, IAmazonS3 s3, FileStorageDb db) =>
{
    if (file == null || file.Length == 0)
        return Results.BadRequest(error: "Cannot upload empty file!");

    string fileKey = Guid.NewGuid().ToString();
    var request = new PutObjectRequest()
    {
        BucketName = s3Bucket,
        Key = fileKey,
        InputStream = file.OpenReadStream()
    };

    request.Metadata.Add("Content-Type", file.ContentType);
    var response = await s3.PutObjectAsync(request);
    if (response.HttpStatusCode == System.Net.HttpStatusCode.OK)
    {
        var fileEntry = new FileEntry(file.FileName, fileKey);
        db.Files.Add(fileEntry);
        await db.SaveChangesAsync();

        return Results.Created($"/api/files/{fileEntry.Id}", file);
    }
    return Results.BadRequest("Couldn't upload this file to AWS S3");
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