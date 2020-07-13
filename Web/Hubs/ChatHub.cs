using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Models;

namespace Web.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(MessageInfo message)
        {
            await Clients.Others.SendAsync("updateMessages", message);
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }
    }
}
