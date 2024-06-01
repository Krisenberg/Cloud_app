using Amazon.S3;
using Amazon.S3.Model;
using CloudStorage.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace CloudStorage.Utils
{
    public static class VerifyDatabaseEntries
    {
        //private readonly string _s3Bucket;
        //private FileStorageDb _db;
        //private readonly IAmazonS3 _s3;

        //public VerifyDatabaseEntries(string s3Bucket, FileStorageDb db, IAmazonS3 s3)
        //{
        //    _s3Bucket = s3Bucket;
        //    _db = db;
        //    _s3 = s3;
        //}

        //public async Task StartAsync(CancellationToken cancellationToken)
        //{
        //    await Task.Run(VerifyDatabase, cancellationToken);
        //    await Task.Run(MigrateDatabase, cancellationToken);
        //}

        //public Task StopAsync(CancellationToken cancellationToken)
        //{
        //    // Clean up if needed
        //    return Task.CompletedTask;
        //}

        //private async void MigrateDatabase()
        //{
        //    await _db.Database.MigrateAsync();
        //}

        public static async Task VerifyDatabase(string s3Bucket, FileStorageDb db, IAmazonS3 s3)
        {
            List<FileEntry> fileEntries = await db.Files.ToListAsync();

            foreach (FileEntry fileEntry in fileEntries)
            {
                try
                {
                    var metadata = await s3.GetObjectMetadataAsync(new GetObjectMetadataRequest
                    {
                        BucketName = s3Bucket,
                        Key = fileEntry.S3Key
                    });
                }
                catch (AmazonS3Exception e) when (e.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    db.Files.Remove(fileEntry);
                }
            }
            await db.SaveChangesAsync();
        }
    }
}
