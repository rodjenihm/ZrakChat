using Dapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Web.Helpers;
using Web.Models;
using Web.Services;

namespace Web.Hubs
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatHub : Hub
    {
        private readonly IUserService userService;

        public ChatHub(IUserService userService)
        {
            this.userService = userService;
        }

        public async Task SendMessage(MessageInfo message)
        {
            var sendTo = (await userService.GetUsersByRoomIdAsync(message.RoomId))
                    .Where(u => u != message.Username)
                    .ToList();

            await Clients.Users(sendTo).SendAsync("updateMessages", message);
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }
    }
}
