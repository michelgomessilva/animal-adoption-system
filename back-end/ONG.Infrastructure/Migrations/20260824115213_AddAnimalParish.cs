using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ONG.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAnimalParish : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Parish",
                table: "Animals",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Parish",
                table: "Animals");
        }
    }
}
