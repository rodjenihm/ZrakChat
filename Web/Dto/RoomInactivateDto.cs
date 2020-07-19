﻿using System.ComponentModel.DataAnnotations;

namespace Web.Dto
{
    public class RoomInactivateDto
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public int RoomId { get; set; }
    }
}
