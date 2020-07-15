using System;

namespace Web.Models
{
    public class UserConnection
    {
        public DateTime Created { get; set; }
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ConnectionId { get; set; }
    }
}
