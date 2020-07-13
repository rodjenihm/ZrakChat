using System;
using System.Collections.Generic;

namespace Web.Models
{
    public class UserRoom
    {
        public DateTime Created { get; set; }
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public MessageInfo LastMessage { get; set; }
        public IEnumerable<MessageInfo> Messages { get; set; }
    }
}
