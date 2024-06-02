using Amazon.S3;
using Microsoft.EntityFrameworkCore;
using CloudStorage;
using CloudStorage.Models;
using DotNetEnv;
using Microsoft.AspNetCore.Builder;
using Amazon.Extensions.NETCore.Setup;
using Amazon.Runtime;
using Amazon.S3.Model;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using CloudStorage.Utils;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Net;

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


// Loads the AWS Configuration from the appsettings.json into the application’s runtime
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
        //sqlServerOptionsAction: sqlOptions =>
        //{
        //    sqlOptions.EnableRetryOnFailure();
        //})
    //);

//builder.Services.AddHostedService<VerifyDatabaseEntries>(serviceProvider =>
//{
//    var db = serviceProvider.GetRequiredService<FileStorageDb>();
//    var s3 = serviceProvider.GetRequiredService<IAmazonS3>();

//    return new VerifyDatabaseEntries(s3Bucket: s3Bucket, db: db, s3: s3);
//});

builder.Services.AddCors(options =>
{
    options.AddPolicy("reactFrontend", policy =>
    {
        string frontend_ip = Environment.GetEnvironmentVariable("APP_FRONTEND") ?? "http://localhost:3000";
        policy.WithOrigins(frontend_ip)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithExposedHeaders("Content-Disposition");
    });
});

var app = builder.Build();

app.UseCors("reactFrontend");

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<FileStorageDb>();
    //var s3Service = scope.ServiceProvider.GetRequiredService<IAmazonS3>();
    //dbContext.Database.Migrate();
    //await VerifyDatabaseEntries.VerifyDatabase(s3Bucket, dbContext, s3Service);
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

app.UseExceptionHandler("/error");

//app.MapRazorPages();

app.Map("/error", () =>
{
    return Results.Problem(detail: "Internal server error", statusCode: 500);
});

app.MapGet("/test", () => "Example response - this endpoint is working!");

app.MapGet("/api/files", async (FileStorageDb db) =>
{
    List<FileEntry> fileEntries = await db.Files.ToListAsync();
    List<FileDTO> fileDTOs = fileEntries.Select(file => 
        new FileDTO(id: file.Id, filename: file.FileName)).ToList();
    return fileDTOs;
});

//app.MapPost("/api/files", async (FileEntry file, FileStorageDb db) =>
//{
//    db.Files.Add(file);
//    await db.SaveChangesAsync();

//    return Results.Created($"/files/{file.Id}", file);
//});

app.MapGet("/api/files/{id}", async (int id, IAmazonS3 s3, FileStorageDb db) =>
{
    FileEntry? fileEntry = await db.Files.FindAsync(id);

    if (fileEntry == null)
        return Results.NotFound(value: "File with provided id not found in the database");

    var request = new GetObjectRequest()
    {
        BucketName = s3Bucket,
        Key = fileEntry.S3Key,
    };

    GetObjectResponse? response = null;
    try
    {
        response = await s3.GetObjectAsync(request);
    }
    catch (Exception e)
    {
        return Results.NotFound(e.Message);
    }

    if (response == null)
        return Results.NotFound("File could not be downloaded from S3 bucket");

    //Stream fileStream = Stream.Null;
    //using (response)
    //{
    //    await response.ResponseStream.Co;
    //    //var fileStream = response.ResponseStream;
    //    //var contentType = response.Headers["Content-Type"];
    //    //var fileName = fileEntry.FileName;
    //    //return Results.File(fileStream: fileStream, contentType: contentType, fileDownloadName: fileName);
    //}
    //var contentType = response.Headers["Content-Type"];
    //var fileName = fileEntry.FileName;
    return Results.File(
        fileStream: response.ResponseStream,
        contentType: response.Headers["Content-Type"],
        fileDownloadName: fileEntry.FileName
    );
});

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
        var fileEntry = new FileEntry(fileName: file.FileName, s3Key: fileKey);
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
    file.S3Key = newFileData.S3Key;

    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();
