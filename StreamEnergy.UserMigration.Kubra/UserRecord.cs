using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.UserMigration.Kubra
{
    class UserRecord
    {
        public string Username { get; set; }
        public Guid GlobalCustomerId { get; set; }
        public string EmailAddress { get; set; }
    }
}
