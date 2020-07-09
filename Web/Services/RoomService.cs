using Dapper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Web.Entities;
using Web.Helpers;

namespace Web.Services
{
    public interface IRoomService
    {
        Task<UserRoom> CreatePrivateRoomForUsersAsync(int id1, int id2);
        Task<IEnumerable<UserRoom>> GetActiveRoomsByUserIdAsync(int userId);
    }

    public class RoomService : IRoomService
    {
        private readonly ConnectionString connectionString;

        public RoomService(ConnectionString connectionString)
        {
            this.connectionString = connectionString;
        }

        public async Task<UserRoom> CreatePrivateRoomForUsersAsync(int id1, int id2)
        {
            using var connection = new SqlConnection(connectionString.Value);
            var userRoom = (await connection.QueryAsync<UserRoom>
                ("uspCreatePrivateRoom @UserId1, @UserId2", new { UserId1 = id1, UserId2 = id2 }))
                .FirstOrDefault();
            return userRoom;
        }

        public async Task<IEnumerable<UserRoom>> GetActiveRoomsByUserIdAsync(int userId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            var userRooms = await connection.QueryAsync<UserRoom>
                ("uspGetActiveRoomsByUserId @UserId", new { UserId = userId });
            return userRooms;
        }
    }
}
