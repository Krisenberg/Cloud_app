using Amazon.S3;
using Microsoft.EntityFrameworkCore;
using CloudStorage;
using CloudStorage.Models;
using DotNetEnv;
using Amazon.Runtime;
using Amazon.S3.Model;
using CloudStorage.Utils;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

builder.Services.AddAuthorization();

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

builder.Services.AddSingleton<IAmazonS3>(serviceProvider =>
{
    AmazonS3Client s3Client = new AmazonS3Client(
        credentials: new SessionAWSCredentials(
            awsAccessKeyId: awsAccessKeyId,
            awsSecretAccessKey: awsSecretAccessKey,
            token: awsSessionToken
        ),
        region: Amazon.RegionEndpoint.GetBySystemName(awsRegion)
    );

    return s3Client;
});

string? appDomain = Environment.GetEnvironmentVariable("APP_DOMAIN");
string? databasePort = Environment.GetEnvironmentVariable("DATABASE_PORT");
string? frontendPort = Environment.GetEnvironmentVariable("FRONTEND_PORT");

string databaseUrl = (databasePort == null) ? $"{appDomain},1433" : $"{appDomain},{databasePort}";
string frontendUrl = (frontendPort == null) ? $"http://{appDomain}:3000" : $"http://{appDomain}:{frontendPort}";

string? saPassword = Environment.GetEnvironmentVariable("MSSQL_SA_PASSWORD");
var connectionString = builder.Configuration.GetConnectionString("FileStorageDb");

if (connectionString != null)
{
    connectionString = connectionString.Replace("<MSSQL_SA_PASSWORD>", saPassword);
    connectionString = connectionString.Replace("<DATABASE_URL>", databaseUrl);
}

builder.Services.AddDbContextPool<FileStorageDb>(options =>
    options.UseSqlServer(connectionString));


builder.Services.AddCors(options =>
{
    options.AddPolicy("reactFrontend", policy =>
    {
        policy.WithOrigins(frontendUrl)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithExposedHeaders("Content-Disposition");
    });
});

var app = builder.Build();

app.UseCors("reactFrontend");

bool startupErrorOccurred = false;
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<FileStorageDb>();
    var s3Service = scope.ServiceProvider.GetRequiredService<IAmazonS3>();
    try
    {
        dbContext.Database.Migrate();
        await VerifyDatabaseEntries.VerifyDatabase(s3Bucket, dbContext, s3Service);
    }
    catch (Exception ex)
    {
        // Log the exception
        Console.WriteLine($"Startup error: {ex.Message}");
        startupErrorOccurred = true;
    }
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

app.Map("/error", () =>
{
    return Results.Problem(detail: "Internal server error", statusCode: 500);
});

if (startupErrorOccurred)
{
    app.Map("/", context =>
    {
        context.Response.Redirect("/startup-error");
        return Task.CompletedTask;
    });
}

app.Map("/startup-error", () =>
{
    return Results.Problem(detail: "Error occurred during startup", statusCode: 500);
});

app.MapGet("/test", () => "Example response - this endpoint is working!");

app.MapGet("/api/files", async (FileStorageDb db) =>
{
    List<FileEntry> fileEntries = await db.Files.ToListAsync();
    List<FileDTO> fileDTOs = fileEntries.Select(file => 
        new FileDTO(id: file.Id, filename: file.FileName)).ToList();
    return fileDTOs;
});

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

    return Results.File(
        fileStream: response.ResponseStream,
        contentType: response.Headers["Content-Type"],
        fileDownloadName: fileEntry.FileName
    );
});

app.MapPost("/api/files", async (HttpRequest frontendRequest, IAmazonS3 s3, FileStorageDb db) =>
{
    var form = await frontendRequest.ReadFormAsync();
    var file = form.Files["file"];
    var customFileName = form["fileName"].ToString();

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
        var fileEntry = new FileEntry(fileName: customFileName, s3Key: fileKey);
        db.Files.Add(fileEntry);
        await db.SaveChangesAsync();

        return Results.Created($"/api/files/{fileEntry.Id}", file);
    }
    return Results.BadRequest("Couldn't upload this file to AWS S3");
});

app.MapPut("/api/files/{id}", async (int id, FileDTO newFileData, FileStorageDb db) =>
{
    var file = await db.Files.FindAsync(id);

    if (file is null) return Results.NotFound();

    file.FileName = newFileData.FileName;
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapDelete("/api/files/{id}", async (int id, IAmazonS3 s3, FileStorageDb db) =>
{
    var file = await db.Files.FindAsync(id);

    if (file is null) return Results.NotFound();

    await s3.DeleteObjectAsync(new DeleteObjectRequest
    {
        BucketName = s3Bucket,
        Key = file.S3Key
    });

    db.Files.Remove(file);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();
