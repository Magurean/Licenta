using BackendLicenta.Context;
using System.Linq;

namespace BackendLicenta.Resource;

public class UserResource : IUserResource
{
    private readonly UserContext context;

    public UserResource(UserContext context)
    {
        this.context = context;
    }

    public User[] GetUsers()
    {
        return context.Users.OrderBy(x => x.Id).ToArray();
    }

    public User GetUserByName(string username)
    {
        return context.Users.Where(x => x.Username == username).FirstOrDefault();
    }

    public string CreateUser(User user)
    {
        if (context.Users.Any(x => x.Username == user.Username))
        {
            return "not ok";
        }

        context.Users.Add(user);
        context.SaveChanges();
        return "ok";
    }

    public User LoginUser(User user)
    {
        return context.Users.FirstOrDefault(x => x.Username == user.Username && x.Password == user.Password);
    }

    public string UpdateUser(User user)
    {
        User oldUser = context.Users.Where(x => x.Id == user.Id).FirstOrDefault();

        if (oldUser != null)
        {
            oldUser.Username = user.Username;
            oldUser.MinesweeperScoreEasy = user.MinesweeperScoreEasy;
            oldUser.MinesweeperScoreMedium = user.MinesweeperScoreMedium;
            oldUser.MinesweeperScoreHard = user.MinesweeperScoreHard;
            oldUser.WordleGamesPlayed = user.WordleGamesPlayed;
            oldUser.WordleGamesWon = user.WordleGamesWon;
            oldUser.Game2048Score = user.Game2048Score;
            context.SaveChanges();
            return "ok";
        }
        return "not ok";
    }
}
