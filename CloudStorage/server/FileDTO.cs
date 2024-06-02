namespace CloudStorage
{
    public class FileDTO
    {
        public int Id { get; set; }
        public string FileName { get; set; }

        public FileDTO(int id, string? filename)
        {
            Id = id;
            FileName = filename;
        }
    }
}
