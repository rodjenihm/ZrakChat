using Dapper;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Web.Entities;
using Web.Helpers;

namespace Web.Services
{
    public interface IMessageService
    {
        Task<bool> SendMessage(Message message);
    }

    public class MessageService : IMessageService
    {
        private readonly ConnectionString connectionString;

        public MessageService(ConnectionString connectionString)
        {
            this.connectionString = connectionString;
        }

        public async Task<bool> SendMessage(Message message)
        {
            using var connection = new SqlConnection(connectionString.Value);
            await connection.ExecuteAsync
                ("uspSendMessage @UserId, @RoomId, @Text", message);
            return true;
        }
    }
}
