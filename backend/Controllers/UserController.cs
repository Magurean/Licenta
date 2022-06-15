using BackendLicenta.Context;
using BackendLicenta.Resource;
using Microsoft.AspNetCore.Mvc;
using System;
using HttpGetAttribute = Microsoft.AspNetCore.Mvc.HttpGetAttribute;
using HttpPostAttribute = Microsoft.AspNetCore.Mvc.HttpPostAttribute;
using HttpPutAttribute = Microsoft.AspNetCore.Mvc.HttpPutAttribute;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace BackendLicenta.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserResource userResource;
    public UserController(IUserResource userResource)
    {
        this.userResource = userResource;
    }

    [HttpGet]
    public User[] Get()
    {
        return userResource.GetUsers();
    }

    [HttpGet]
    [Route("{username}")]
    public User GetUserByUsername(string username)
    {
        return userResource.GetUserByName(username);
    }

    [HttpPost]
    public ObjectResult CreateUser(User user)
    {
        if (user.Email is not null)
        {
            user.Id = Guid.NewGuid();

            string result = userResource.CreateUser(user);
            if (result == "not ok")
            {
                return BadRequest(result);
            }

            return Ok(user);
        }
        else
        {
            User checkValidUser = userResource.LoginUser(user);

            if (checkValidUser is null)
            {
                return BadRequest("user not found");
            }
            return Ok(checkValidUser);
        }
    }

    [HttpPut]
    public string UpdateUser(User user)
    {
        return userResource.UpdateUser(user);
    }
}
