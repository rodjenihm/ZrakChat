using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Web.Helpers;
using Web.Models;

namespace Web.Services
{

    public class RoomService : IRoomService
    {
        private readonly ConnectionString connectionString;

        public RoomService(ConnectionString connectionString)
        {
            this.connectionString = connectionString;
        }

        public async Task<UserRoom> CreateGroupRoomForUserAsync(int userId, string displayName, IEnumerable<int> memberKeys)
        {
            using var connection = new SqlConnection(connectionString.Value);
            var dt = new DataTable();
            dt.Columns.Add("Id", typeof(int));

            foreach (var memberKey in memberKeys)
                dt.Rows.Add(memberKey);

            var userRoom = (await connection.QueryAsync<UserRoom>
                ("uspCreateGroupRoom",
                new
                {
                    UserId = userId,
                    DisplayName = displayName,
                    MemberKeys = dt.AsTableValuedParameter("dbo.PRIMARYKEYS"),
                    Created = DateTime.UtcNow
                },
                    commandType: CommandType.StoredProcedure))
                .FirstOrDefault();
            return userRoom;
        }

        public async Task<UserRoom> CreatePrivateRoomForUsersAsync(int id1, int id2)
        {
            using var connection = new SqlConnection(connectionString.Value);
            var userRoom = (await connection.QueryAsync<UserRoom>
                ("uspCreatePrivateRoom @UserId1, @UserId2, @Created",
                new { UserId1 = id1, UserId2 = id2, Created = DateTime.UtcNow }))
                .FirstOrDefault();
            return userRoom;
        }

        public async Task<IEnumerable<UserRoom>> GetActiveRoomsByUserIdAsync(int userId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            var userRooms = await connection.QueryAsync
                (
                "uspGetActiveRoomsByUserId @UserId",
                (Func<UserRoom, MessageInfo, UserRoom>)((ur, mi) =>
                {
                    ur.LastMessage = mi;
                    return ur;
                }),
                new { UserId = userId }, splitOn: "Sent");
            return userRooms;
        }

        public async Task<UserRoom> GetPrivateRoomForUsersAsync(int id1, int id2)
        {
            using var connection = new SqlConnection(connectionString.Value);
            var userRoom = (await connection.QueryAsync<UserRoom>
                ("uspGetPrivateRoom @UserId1, @UserId2", new { UserId1 = id1, UserId2 = id2 }))
                .FirstOrDefault();
            return userRoom;
        }

        public async Task<IEnumerable<VUser>> GetRoomMembersByRoomIdAsync(int roomId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            var users = await connection.QueryAsync<VUser>
                ("uspGetUsersByRoomId @RoomId", new { RoomId = roomId });
            return users;
        }

        public async Task InactivateRoomAsync(int userId, int roomId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            await connection.ExecuteAsync
                ("uspInactivateUserRoom @UserId, @RoomId", new { UserId = userId, RoomId = roomId });
        }
    }
}
