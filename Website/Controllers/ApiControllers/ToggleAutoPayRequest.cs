using System.Collections;
using System.Collections.Generic;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class ToggleAutoPayRequest
    {
        public string oldID { get; set; }
        public string newID { get; set; }
    }
}