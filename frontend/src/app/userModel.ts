export interface User {
    id: number;
    name: string;
    minesweeperScoreEasy: number;
    minesweeperScoreMedium: number;
    minesweeperScoreHard: number;
    game2048Score: number;
    wordleGamesPlayed: number;
    wordleGamesWon: number;
}

export interface UserLogin {
    username: string;
    password: string;
    email?: string;
}