using Amazon.S3;
using Amazon.S3.Model;
using CloudStorage.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace CloudStorage.Utils
{
    public static class VerifyDatabaseEntries
    {
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
