using System;

namespace Web.Models
{
    public class VUser
    {
        public DateTime Created { get; set; }
        public int Id { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public bool IsConnected { get; set; }
    }
}
