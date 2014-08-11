using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.LuceneServices.IndexGeneration.SmartyStreets
{
    public class SmartyResponse
    {
        public int InputIndex { get; set; }
        public SmartyStreetAddress Components { get; set; }
    }
}
