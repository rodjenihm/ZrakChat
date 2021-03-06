﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Models;

namespace Web.Services
{
    public interface IUserService
    {
        Task<bool> RegisterUserAsync(User user);
        Task<bool> IsUsernameAvailableAsync(string username);
        Task<User> GetUserByUsernameAsync(string username);
        Task<IEnumerable<VUser>> GetUsersBySearchTermAsync(string term);
        Task<IEnumerable<string>> GetUsersByRoomIdAsync(int roomId);
        Task<bool> SetLastSeenAsync(int userId);
    }
}
