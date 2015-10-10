using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Currents
{
    public class RadioItem
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime ItemDate { get; set; }
        public string Iframe { get; set; }
    }
}