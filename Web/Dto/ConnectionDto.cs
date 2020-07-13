using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

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
