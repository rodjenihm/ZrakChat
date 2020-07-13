using System;

namespace Web.Models
{
    public class MessageInfo
    {
        public DateTime Sent { get; set; }
        public int Id { get; set; }
        public int RoomId { get; set; }
        public string Text { get; set; }
        public string Username { get; set; }
    }
}
