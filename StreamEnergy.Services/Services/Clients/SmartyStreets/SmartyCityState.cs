using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients.SmartyStreets
{
    public class SmartyCityState
    {
        public string City { get; set; }

        public string StateAbbreviation { get; set; }

        public string State { get; set; }

        public string MailableCity { get; set; }
    }
}
