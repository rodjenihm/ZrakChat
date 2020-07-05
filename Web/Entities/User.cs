using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Entities
{
    public class User
    {
        public DateTime Created { get; set; }
        public int Id { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string PasswordHash { get; set; }
    }
}
