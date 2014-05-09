using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy
{
    public class TypeIndicatorLookup
    {
        public Type SuperType { get; set; }
        public Type Concrete { get; set; }
        public Predicate<JObject> IsMatch { get; set; }
    }
}
