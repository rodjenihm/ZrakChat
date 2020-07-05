using System.ComponentModel.DataAnnotations;

namespace Web.Dto
{
    public class ContactDto
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public int ContactId { get; set; }
    }
}
