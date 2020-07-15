using System.ComponentModel.DataAnnotations;

namespace Web.Dto
{
    public class ConnectionDto
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public string ConnectionId { get; set; }
    }
}
