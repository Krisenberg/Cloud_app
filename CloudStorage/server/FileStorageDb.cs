using CloudStorage.Models;
using Microsoft.EntityFrameworkCore;

namespace CloudStorage
{
    public class FileStorageDb : DbContext
    {
        public FileStorageDb(DbContextOptions<FileStorageDb> options)
            : base(options) { }

        public DbSet<FileEntry> Files { get; set; }
    }
}
