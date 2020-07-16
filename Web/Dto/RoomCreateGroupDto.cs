using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Web.Dto
{
    public class RoomCreateGroupDto
    {
        [Required]
        public int CreatorId { get; set; }
        [Required]
        public string DisplayName { get; set; }
        [Required]
        public IEnumerable<int> MemberKeys { get; set; }
    }
}
