using Dapper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Web.Helpers;
using Web.Models;

namespace Web.Services
{
    public class UserService : IUserService
    {
        private readonly ConnectionString connectionString;

        public UserService(ConnectionString connectionString)
        {
            this.connectionString = connectionString;
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            using var connection = new SqlConnection(connectionString.Value);
            return (await connection.QueryAsync<User>("uspGetUserByUsername @Username", new { Username = username })).FirstOrDefault();
        }

        public async Task<IEnumerable<string>> GetUsersByRoomIdAsync(int roomId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            var usernames = (await connection.QueryAsync<VUser>
                ("uspGetUsersByRoomId @RoomId", new { RoomId = roomId }))
                .Select(u => u.Username);
            return usernames;
        }

        public async Task<IEnumerable<VUser>> GetUsersBySearchTermAsync(string term)
        {
            using var connection = new SqlConnection(connectionString.Value);
            return await connection.QueryAsync<VUser>("uspUserSearchByTerm @Term", new { Term = $"{term}%" });
        }

        public async Task<bool> IsUsernameAvailableAsync(string username)
        {
            using var connection = new SqlConnection(connectionString.Value);
            return await connection.ExecuteScalarAsync<bool>("uspIsUsernameAvailable @Username", new { Username = username });
        }

        public async Task<bool> RegisterUserAsync(User user)
        {
            using var connection = new SqlConnection(connectionString.Value);
            await connection.ExecuteAsync("uspRegisterUser @Username, @DisplayName, @PasswordHash", user);
            return true;
        }

        public async Task<bool> SetLastSeenAsync(int userId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            await connection.ExecuteAsync("uspUpdateUserLastSeen @UserId, @LastSeen", new { UserId = userId, LastSeen = DateTime.Now });
            return true;
        }
    }
}
