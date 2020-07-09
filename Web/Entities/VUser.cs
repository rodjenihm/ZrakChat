using System;

namespace Web.Entities
{
    public class VUser
    {
        public DateTime Created { get; set; }
        public int Id { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
    }
}
