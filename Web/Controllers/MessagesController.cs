using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Web.Dto;
using Web.Models;
using Web.Hubs;
using Web.Services;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService messageService;
        private readonly IHubContext<ChatHub> context;

        public MessagesController(IMessageService messageService, IHubContext<ChatHub> context)
        {
            this.messageService = messageService;
            this.context = context;
        }

        [HttpGet("getByRoomIdForUserId")]
        public async Task<IActionResult> GetByRoomIdForUserId(int? userId, int? roomId)
        {
            if (!userId.HasValue)
                return BadRequest(new { message = "UserId doesn't belong to an existing user." });
            if (!roomId.HasValue)
                return BadRequest(new { message = "RoomId doesn't belong to an existing room." });

            try
            {
                var claimId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "id").Value);
                if (userId != claimId)
                    return StatusCode(StatusCodes.Status401Unauthorized);

                var messages = await messageService.GetMessagesByRoomIdAsync(userId.Value, roomId.Value);
                return Ok(messages);
            }
            catch (SqlException e)
            {
                return BadRequest(new { message = e.Message });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPost("send")]
        public async Task<IActionResult> Send([FromServices] IUserService userService, MessageSendDto model)
        {
            try
            {
                var claimId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "id").Value);
                if (model.UserId != claimId)
                    return StatusCode(StatusCodes.Status401Unauthorized);

                var message = new Message { UserId = model.UserId, RoomId = model.RoomId, Text = model.Text };

                message = await messageService.SendMessage(message);

                var messageInfo = new MessageInfo
                {
                    Sent = message.Created,
                    Id = message.Id,
                    RoomId = message.RoomId,
                    Text = message.Text,
                    Username = User.Identity.Name
                };

                var sendTo = (await userService.GetUsersByRoomIdAsync(messageInfo.RoomId))
                    .Where(u => u != messageInfo.Username)
                    .ToList();

                Task.Run(() => context.Clients.Users(sendTo).SendAsync("updateMessages", messageInfo));

                return Ok(messageInfo);
            }
            catch (SqlException e)
            {
                return BadRequest(new { message = e.Message });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
