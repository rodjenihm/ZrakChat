using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Web.Dto;
using Web.Models;
using Web.Services;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RoomsController : ControllerBase
    {
        private readonly IRoomService roomService;

        public RoomsController(IRoomService roomService)
        {
            this.roomService = roomService;
        }

        [HttpGet("getActiveByUserId")]
        public async Task<IActionResult> GetByUserId(int? userId)
        {
            if (!userId.HasValue)
                return BadRequest(new { message = "UserId doesn't belong to an existing user." });

            try
            {
                var claimId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "id").Value);
                if (userId != claimId)
                    return StatusCode(StatusCodes.Status401Unauthorized);

                var userRooms = await roomService.GetActiveRoomsByUserIdAsync(userId.Value);

                foreach (var userRoom in userRooms)
                    userRoom.Members = await roomService.GetRoomMembersByRoomIdAsync(userRoom.Id);

                return Ok(userRooms);
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

        [HttpPost("createPrivate")]
        public async Task<IActionResult> CreatePrivate(RoomCreatePrivateDto model)
        {
            try
            {
                var claimId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "id").Value);
                if (model.CreatorId != claimId)
                    return StatusCode(StatusCodes.Status401Unauthorized);

                UserRoom userRoom;

                userRoom = await roomService.GetPrivateRoomForUsersAsync(model.CreatorId, model.ObjectId);
                if (userRoom == null)
                    userRoom = await roomService.CreatePrivateRoomForUsersAsync(model.CreatorId, model.ObjectId);

                return Ok(userRoom);
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

        [HttpPost("createGroup")]
        public async Task<IActionResult> CreateGroup(RoomCreateGroupDto model)
        {
            try
            {
                if (model.MemberKeys.Count() <= 2)
                    return BadRequest(new { message = "List of member Ids is invalid." });

                var claimId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "id").Value);
                if (model.CreatorId != claimId)
                    return StatusCode(StatusCodes.Status401Unauthorized);

                var userRoom = await roomService.CreateGroupRoomForUserAsync(model.CreatorId, model.DisplayName, model.MemberKeys);

                return Ok(userRoom);
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

        [HttpPost("inactivate")]
        public async Task<IActionResult> Inactivate(RoomInactivateDto model)
        {
            try
            {
                var claimId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "id").Value);
                if (model.UserId != claimId)
                    return StatusCode(StatusCodes.Status401Unauthorized);

                await roomService.InactivateRoomAsync(model.UserId, model.RoomId);

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
