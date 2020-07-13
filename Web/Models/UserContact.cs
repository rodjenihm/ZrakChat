using System;

namespace Web.Models
{
    public class UserContact
    {
        public DateTime Created { get; set; }
        public int Id { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
    }
}
