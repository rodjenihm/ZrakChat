using Dapper;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Web.Entities;
using Web.Helpers;

namespace Web.Services
{
    public interface IMessageService
    {
        Task<Message> SendMessage(Message message);
        Task<IEnumerable<MessageInfo>> GetMessagesByRoomIdAsync(int userId, int roomId);
    }

    public class MessageService : IMessageService
    {
        private readonly ConnectionString connectionString;

        public MessageService(ConnectionString connectionString)
        {
            this.connectionString = connectionString;
        }

        public async Task<IEnumerable<MessageInfo>> GetMessagesByRoomIdAsync(int userId, int roomId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            var messages = await connection.QueryAsync<MessageInfo>
                ("uspGetMessagesByRoomIdForUserId @UserId, @RoomId", new { UserId = userId, RoomId = roomId });
            return messages;
        }

        public async Task<Message> SendMessage(Message message)
        {
            using var connection = new SqlConnection(connectionString.Value);
            var messageInfo = (await connection.QueryAsync<Message>
                ("uspSendMessage @UserId, @RoomId, @Text", message))
                .FirstOrDefault();
            return messageInfo;
        }
    }
}
