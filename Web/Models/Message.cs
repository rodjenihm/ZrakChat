using System;

namespace Web.Models
{
    public class Message
    {
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RoomId { get; set; }
        public string Text { get; set; }
    }
}
