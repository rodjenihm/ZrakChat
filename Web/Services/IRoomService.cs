using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Models;

namespace Web.Services
{
    public interface IRoomService
    {
        Task<UserRoom> CreatePrivateRoomForUsersAsync(int id1, int id2);
        Task<UserRoom> GetPrivateRoomForUsersAsync(int id1, int id2);
        Task<UserRoom> CreateGroupRoomForUserAsync(int userId, string displayName, IEnumerable<int> memberKeys);
        Task<IEnumerable<UserRoom>> GetActiveRoomsByUserIdAsync(int userId);
        Task<UserRoom> GetActiveRoomByUserIdAndRoomIdAsync(int userId, int roomId);
        Task<IEnumerable<VUser>> GetRoomMembersByRoomIdAsync(int roomId);
        Task InactivateRoomAsync(int userId, int roomId);
    }
}
