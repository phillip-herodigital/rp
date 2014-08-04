using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients.StreamConnect
{
    class MoveInDate
    {
        public DateTime Date { get; set; }
        public bool Priority { get; set; }
        public IEnumerable<Fee> Fees { get; set; }
    }
}
