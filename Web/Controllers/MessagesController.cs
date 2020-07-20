using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Web.Dto;
using Web.Hubs;
using Web.Models;
using Web.Services;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly IMessageService messageService;
        private readonly IHubContext<ChatHub> context;

        public MessagesController(IUserService userService, IMessageService messageService, IHubContext<ChatHub> context)
        {
            this.userService = userService;
            this.messageService = messageService;
            this.context = context;
        }

        [HttpPost("setLastSeenByRoomIdForUserId")]
        public async Task<IActionResult> SetLastSeenByRoomIdForUserId(MessageSetSeenDto model)
        {
            try
            {
                var claimId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "id").Value);
                if (model.UserId != claimId)
                    return StatusCode(StatusCodes.Status401Unauthorized);

                await messageService.SetLastSeenMessageByRoomIdAsync(model.UserId, model.RoomId, model.MessageId);

                var sendTo = (await userService.GetUsersByRoomIdAsync(model.RoomId))
                    .Where(u => u != User.Identity.Name)
                    .ToList();

                Debug.WriteLine(User.Identity.Name);

                context.Clients.Users(sendTo).SendAsync("updateLastSeenMessageId", model.RoomId, model.UserId, model.MessageId);

                return Ok();
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

                var messages = await messageService.GetByRoomIdForUserIdAsync(userId.Value, roomId.Value);
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
        public async Task<IActionResult> Send(MessageSendDto model)
        {
            try
            {
                var claimId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "id").Value);
                if (model.UserId != claimId)
                    return StatusCode(StatusCodes.Status401Unauthorized);

                var message = new Message { UserId = model.UserId, RoomId = model.RoomId, Text = model.Text };

                message = await messageService.SendMessageAsync(message);

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

                context.Clients.Users(sendTo).SendAsync("updateMessages", messageInfo);

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
