using System.Collections.Generic;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class SetAutoPayRequest
    {
        public bool IsAutoPay { get; set; }
        public IEnumerable<CartEntry> Cart { get; set; }
    }
}