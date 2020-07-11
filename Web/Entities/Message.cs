using System;

namespace Web.Entities
{
    public class Message
    {
        public DateTime Created { get; set; }
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RoomId { get; set; }
        public string Text { get; set; }
    }
}
