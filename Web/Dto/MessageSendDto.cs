using System.ComponentModel.DataAnnotations;

namespace Web.Dto
{
    public class MessageSendDto
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public int RoomId { get; set; }
        [Required]
        [MaxLength(255)]
        public string Text { get; set; }
    }
}
