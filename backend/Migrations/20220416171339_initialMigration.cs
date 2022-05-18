using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendLicenta.Migrations
{
    public partial class initialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MinesweeperScoreEasy = table.Column<int>(type: "int", nullable: false),
                    MinesweeperScoreMedium = table.Column<int>(type: "int", nullable: false),
                    MinesweeperScoreHard = table.Column<int>(type: "int", nullable: false),
                    Game2048Score = table.Column<int>(type: "int", nullable: false),
                    WordleScore = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Game2048Score", "MinesweeperScoreEasy", "MinesweeperScoreHard", "MinesweeperScoreMedium", "Password", "Username", "WordleScore" },
                values: new object[] { new Guid("98479990-8d91-4fc0-8b80-43d53bf28c72"), null, 25, 3, 2, 7, null, "John", 25 });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Game2048Score", "MinesweeperScoreEasy", "MinesweeperScoreHard", "MinesweeperScoreMedium", "Password", "Username", "WordleScore" },
                values: new object[] { new Guid("b3b79140-7fed-4f0b-b09f-1140e157b147"), null, 24, 3, 5, 5, null, "Andrei", 56 });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Game2048Score", "MinesweeperScoreEasy", "MinesweeperScoreHard", "MinesweeperScoreMedium", "Password", "Username", "WordleScore" },
                values: new object[] { new Guid("f7bf5314-3dda-4290-9cfc-cd0d508bfa40"), null, 1, 1, 5, 3, null, "Alex", 1 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
