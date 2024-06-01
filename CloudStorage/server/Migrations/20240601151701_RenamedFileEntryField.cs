using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudStorage.Migrations
{
    /// <inheritdoc />
    public partial class RenamedFileEntryField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "S3Url",
                table: "Files",
                newName: "S3Key");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "S3Key",
                table: "Files",
                newName: "S3Url");
        }
    }
}
