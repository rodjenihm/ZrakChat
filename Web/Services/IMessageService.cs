using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Models;

namespace Web.Services
{
    public interface IMessageService
    {
        Task<Message> SendMessage(Message message);
        Task<IEnumerable<MessageInfo>> GetMessagesByRoomIdAsync(int userId, int roomId);
    }
}
