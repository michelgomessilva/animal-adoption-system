using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ONG.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAnimalLocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Animals",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "District",
                table: "Animals",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "City",
                table: "Animals");

            migrationBuilder.DropColumn(
                name: "District",
                table: "Animals");
        }
    }
}
