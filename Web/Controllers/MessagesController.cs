using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Web.Dto;
using Web.Entities;
using Web.Services;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService messageService;

        public MessagesController(IMessageService messageService)
        {
            this.messageService = messageService;
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

                await messageService.SendMessage(message);
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
    }
}
