using System;

namespace Web.Models
{
    public class User
    {
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public int Id { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Role { get; set; }
        public string PasswordHash { get; set; }
        public DateTime LastSeen { get; set; }
    }
}
