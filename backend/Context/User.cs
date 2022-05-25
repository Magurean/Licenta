using System;
using System.ComponentModel.DataAnnotations;

namespace BackendLicenta.Context;

public record User
{
    [Required]
    public Guid Id { get; set; }
    [Required]
    public string Username { get; set; }
    [Required]
    public string Password { get; set; }
    [EmailAddress]
    public string Email { get; set; }
    public int MinesweeperScoreEasy { get; set; }
    public int MinesweeperScoreMedium { get; set; }
    public int MinesweeperScoreHard { get; set; }
    public int Game2048Score { get; set; }
    public int WordleGamesPlayed { get; set; }
    public int WordleGamesWon { get; set; }
}