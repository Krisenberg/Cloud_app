namespace CloudStorage.Models
{
    public class FileEntry
    {
        public int Id { get; set; }
        public string? FileName { get; set; }
        public string? S3Url { get; set; }

        public FileEntry(string? fileName, string? s3Url)
        {
            FileName = fileName;
            S3Url = s3Url;
        }
    }
}
