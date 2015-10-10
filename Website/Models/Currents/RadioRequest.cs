using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Currents
{
    public class RadioRequest
    {
        public string currentItemId { get; set; }
        public int startRowIndex { get; set; }
        public int maximumRows { get; set; }
        public string language { get; set; }
    }
}