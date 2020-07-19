using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Models;

namespace Web.Services
{
    public interface IMessageService
    {
        Task<Message> SendMessageAsync(Message message);
        Task<IEnumerable<MessageInfo>> GetByRoomIdForUserIdAsync(int userId, int roomId);
        Task<bool> SetLastSeenMessageByRoomIdAsync(int userId, int roomId, int messageId);
    }
}
