using Dapper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Web.Helpers;

namespace Web.Services
{
    public class ConnectionService : IConnectionService
    {
        private readonly ConnectionString connectionString;

        public ConnectionService(ConnectionString connectionString)
        {
            this.connectionString = connectionString;
        }

        public async Task CreateConnectionAsync(int userId, string username, string connectionId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            await connection.ExecuteAsync
                ("uspCreateConnection @UserId, @Username, @ConnectionId, @Created",
                new { UserId = userId, Username = username, ConnectionId = connectionId, Created = DateTime.UtcNow });
        }

        public async Task DeleteConnectionAsync(int userId, string username, string connectionId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            await connection.ExecuteAsync
                ("uspDeleteConnection @UserId, @Username, @ConnectionId", new { UserId = userId, Username = username, ConnectionId = connectionId });
        }

        public async Task<IEnumerable<string>> GetConnectionIdsByUserIdAsync(int userId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            var connectionIds = await connection.QueryAsync<string>
                ("uspGetConnectionIdsByUserId @UserId", new { UserId = userId });
            return connectionIds;
        }
    }
}
