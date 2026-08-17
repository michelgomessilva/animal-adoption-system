using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ONG.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminUpdatedAtColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Admins",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            // Backfill any pre-existing row from CreatedAt rather than leaving the
            // AddColumn default (0001-01-01) — that default would misrepresent an
            // untouched row as having been "updated" two millennia before it was created.
            migrationBuilder.Sql("UPDATE \"Admins\" SET \"UpdatedAt\" = \"CreatedAt\";");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Admins");
        }
    }
}
