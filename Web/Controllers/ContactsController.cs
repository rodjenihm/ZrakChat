using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Web.Dto;
using Web.Services;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ContactsController : ControllerBase
    {
        private readonly IContactService contactService;

        public ContactsController(IContactService contactService)
        {
            this.contactService = contactService;
        }

        [HttpGet("getByUserId")]
        public async Task<IActionResult> GetByUserId(int? userId)
        {
            if (!userId.HasValue)
                return BadRequest(new { message = "UserId doesn't belong to an existing user." });

            try
            {
                var claimId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "id").Value);
                if (userId != claimId)
                    return StatusCode(StatusCodes.Status401Unauthorized);

                var userContacts = await contactService.GetContactsByUserIdAsync(userId.Value);
                return Ok(userContacts);
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

        [HttpPost("create")]
        public async Task<IActionResult> Create(ContactDto model)
        {
            try
            {
                var claimId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "id").Value);
                if (model.UserId != claimId)
                    return StatusCode(StatusCodes.Status401Unauthorized);

                var userContact = await contactService.CreateContactAsync(model.UserId, model.ContactId);
                return Ok(userContact);
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

        [HttpPost("delete")]
        public async Task<IActionResult> Delete(ContactDto model)
        {
            try
            {
                var claimId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "id").Value);
                if (model.UserId != claimId)
                    return StatusCode(StatusCodes.Status401Unauthorized);

                await contactService.DeleteContactAsync(model.UserId, model.ContactId);
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
