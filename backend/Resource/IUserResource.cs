using BackendLicenta.Context;

namespace BackendLicenta.Resource;

public interface IUserResource
{
    User[] GetUsers();
    User GetUserByName(string name);
    User LoginUser(User user);
    string UpdateUser(User user);
    string CreateUser(User user);
}
