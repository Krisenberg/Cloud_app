namespace CloudStorage.Models
{
    public class FileEntry
    {
        public int Id { get; set; }
        public string? FileName { get; set; }
        public string? S3Key { get; set; }

        public FileEntry(string? fileName, string? s3Key)
        {
            FileName = fileName;
            S3Key = s3Key;
        }
    }
}
