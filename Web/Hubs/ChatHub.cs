using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;
using Web.Models;
using Web.Services;

namespace Web.Hubs
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatHub : Hub
    {
        private readonly IUserService userService;
        private readonly IConnectionService connectionService;

        public ChatHub(IUserService userService, IConnectionService connectionService)
        {
            this.userService = userService;
            this.connectionService = connectionService;
        }

        public override async Task OnConnectedAsync()
        {

            try
            {
                var claimId = int.Parse(Context.User.Claims.FirstOrDefault(c => c.Type == "id").Value);
                var username = Context.User.Identity.Name;
                var connectionId = Context.ConnectionId;
                await connectionService.CreateConnectionAsync(claimId, username, connectionId);
                await Clients.All.SendAsync("userGoOnline", claimId);
            }
            catch (Exception)
            {
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            try
            {
                var claimId = int.Parse(Context.User.Claims.FirstOrDefault(c => c.Type == "id").Value);
                var username = Context.User.Identity.Name;
                var connectionId = Context.ConnectionId;
                await connectionService.DeleteConnectionAsync(claimId, username, connectionId);
                await Clients.All.SendAsync("userGoOffline", claimId);
            }
            catch (Exception)
            {
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task StartTyping(int roomId, string username)
        {
            var sendTo = (await userService.GetUsersByRoomIdAsync(roomId))
                    .Where(u => u != username)
                    .ToList();

            await Clients.Users(sendTo).SendAsync("userStartTyping", roomId, username);
        }

        public async Task StopTyping(int roomId, string username)
        {
            var sendTo = (await userService.GetUsersByRoomIdAsync(roomId))
                    .Where(u => u != username)
                    .ToList();

            await Clients.Users(sendTo).SendAsync("userStopTyping", roomId, username);
        }
    }
}
