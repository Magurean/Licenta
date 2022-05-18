using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendLicenta.Migrations
{
    public partial class AddedModelAttributeOnUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("98479990-8d91-4fc0-8b80-43d53bf28c72"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("b3b79140-7fed-4f0b-b09f-1140e157b147"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f7bf5314-3dda-4290-9cfc-cd0d508bfa40"));

            migrationBuilder.RenameColumn(
                name: "WordleScore",
                table: "Users",
                newName: "WordleGamesWon");

            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WordleGamesPlayed",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Game2048Score", "MinesweeperScoreEasy", "MinesweeperScoreHard", "MinesweeperScoreMedium", "Password", "Username", "WordleGamesPlayed", "WordleGamesWon" },
                values: new object[] { new Guid("04f63577-77bd-4f62-8314-ffe633000949"), null, 25, 3, 2, 7, "test", "John", 25, 25 });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Game2048Score", "MinesweeperScoreEasy", "MinesweeperScoreHard", "MinesweeperScoreMedium", "Password", "Username", "WordleGamesPlayed", "WordleGamesWon" },
                values: new object[] { new Guid("47f14c82-2a30-475c-9d53-e4236d3a1185"), null, 24, 3, 5, 5, "test", "Andrei", 56, 55 });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Game2048Score", "MinesweeperScoreEasy", "MinesweeperScoreHard", "MinesweeperScoreMedium", "Password", "Username", "WordleGamesPlayed", "WordleGamesWon" },
                values: new object[] { new Guid("8c95696b-b7cf-41af-8ca2-374606cc8b10"), null, 1, 1, 5, 3, "test", "Alex", 20, 6 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("04f63577-77bd-4f62-8314-ffe633000949"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("47f14c82-2a30-475c-9d53-e4236d3a1185"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("8c95696b-b7cf-41af-8ca2-374606cc8b10"));

            migrationBuilder.DropColumn(
                name: "WordleGamesPlayed",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "WordleGamesWon",
                table: "Users",
                newName: "WordleScore");

            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

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
    }
}
