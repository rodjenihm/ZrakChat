using Dapper;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Web.Entities;
using Web.Helpers;

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
    }
}
