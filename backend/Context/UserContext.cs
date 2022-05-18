using Microsoft.EntityFrameworkCore;
using System;

namespace BackendLicenta.Context
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User() { Id = Guid.NewGuid(), Username = "Alex", Password = "test", Game2048Score = 1, MinesweeperScoreEasy = 1, MinesweeperScoreMedium = 3, MinesweeperScoreHard = 5, WordleGamesPlayed = 20, WordleGamesWon = 6 },
                new User() { Id = Guid.NewGuid(), Username = "Andrei", Password = "test", Game2048Score = 24, MinesweeperScoreEasy = 3, MinesweeperScoreMedium = 5, MinesweeperScoreHard = 5, WordleGamesPlayed = 56, WordleGamesWon = 55 },
                new User() { Id = Guid.NewGuid(), Username = "John", Password = "test", Game2048Score = 25, MinesweeperScoreEasy = 3, MinesweeperScoreMedium = 7, MinesweeperScoreHard = 2, WordleGamesPlayed = 25, WordleGamesWon = 25 });
        }
    }
}
