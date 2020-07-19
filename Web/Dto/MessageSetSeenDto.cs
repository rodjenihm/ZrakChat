using System.ComponentModel.DataAnnotations;

namespace Web.Dto
{
    public class MessageSetSeenDto
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public int RoomId { get; set; }
        [Required]
        public int MessageId { get; set; }
    }
}
