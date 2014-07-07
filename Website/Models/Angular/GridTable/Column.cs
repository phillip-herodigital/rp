using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace StreamEnergy.MyStream.Models.Angular.GridTable
{
    public class Column
    {
        public string Field { get; set; }
        public string DisplayName { get; set; }
        public IEnumerable<DeviceType> Hide { get; set; }
    }
}
