using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Models;

namespace Web.Services
{
    public interface IRoomService
    {
        Task<UserRoom> CreatePrivateRoomForUsersAsync(int id1, int id2);
        Task<UserRoom> GetPrivateRoomForUsersAsync(int id1, int id2);
        Task<IEnumerable<UserRoom>> GetActiveRoomsByUserIdAsync(int userId);
    }
}
