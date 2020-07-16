using System.ComponentModel.DataAnnotations;

namespace Web.Dto
{
    public class RoomCreatePrivateDto
    {
        [Required]
        public int CreatorId { get; set; }
        [Required]
        public int ObjectId { get; set; }
    }
}
