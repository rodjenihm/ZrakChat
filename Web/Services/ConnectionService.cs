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
    public interface IConnectionService
    {
        Task CreateConnectionAsync(int userId, string connectionId);
        Task DeleteConnectionAsync(int userId, string connectionId);
        Task<IEnumerable<string>> GetConnectionIdsByUserIdAsync(int userId);
    }
    public class ConnectionService : IConnectionService
    {
        private readonly ConnectionString connectionString;

        public ConnectionService(ConnectionString connectionString)
        {
            this.connectionString = connectionString;
        }

        public async Task CreateConnectionAsync(int userId, string connectionId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            await connection.ExecuteAsync
                ("uspCreateConnection @UserId, @ConnectionId", new { UserId = userId, ConnectionId = connectionId });
        }

        public async Task DeleteConnectionAsync(int userId, string connectionId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            await connection.ExecuteAsync
                ("uspDeleteConnection @UserId, @ConnectionId", new { UserId = userId, ConnectionId = connectionId });
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
