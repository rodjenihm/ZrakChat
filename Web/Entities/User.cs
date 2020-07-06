using System;

namespace Web.Entities
{
    public class User
    {
        public DateTime Created { get; set; }
        public int Id { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Role { get; set; }
        public string PasswordHash { get; set; }
    }

    public class VUser
    {
        public DateTime Created { get; set; }
        public int Id { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
    }
}
