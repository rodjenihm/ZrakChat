using System;

namespace Web.Models
{
    public class Room
    {
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public int Id { get; set; }
    }
}
