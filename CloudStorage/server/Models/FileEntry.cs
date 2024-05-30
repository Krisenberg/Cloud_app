namespace CloudStorage.Models
{
    public class FileEntry
    {
        public int Id { get; set; }
        public string? FileName { get; set; }
        public string? S3Url { get; set; }
    }
}
