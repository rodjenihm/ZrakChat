﻿using Dapper;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Web.Helpers;
using Web.Models;

namespace Web.Services
{
    public class MessageService : IMessageService
    {
        private readonly ConnectionString connectionString;

        public MessageService(ConnectionString connectionString)
        {
            this.connectionString = connectionString;
        }

        public async Task<IEnumerable<MessageInfo>> GetByRoomIdForUserIdAsync(int userId, int roomId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            var messages = await connection.QueryAsync<MessageInfo>
                ("uspGetMessagesByRoomIdForUserId @UserId, @RoomId", new { UserId = userId, RoomId = roomId });
            return messages;
        }

        public async Task<Message> SendMessageAsync(Message message)
        {
            using var connection = new SqlConnection(connectionString.Value);
            var messageInfo = (await connection.QueryAsync<Message>
                ("uspSendMessage @UserId, @RoomId, @Text, @Created", message))
                .FirstOrDefault();
            return messageInfo;
        }

        public async Task<bool> SetLastSeenMessageByRoomIdAsync(int userId, int roomId, int messageId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            await connection.ExecuteAsync
                ("uspSetLastSeenMessageByRoomIdForUserId @UserId, @RoomId, @MessageId",
                new { UserId = userId, RoomId = roomId, MessageId = messageId });
            return true;
        }
    }
}
