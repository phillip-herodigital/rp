using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels
{
    class PhoneSubtypeLookup : ITypeIndicatorLookup
    {
        public Type SuperType
        {
            get { return typeof(Phone); }
        }

        public Type FindMatch(Newtonsoft.Json.Linq.JObject data)
        {
            if (data["category"] != null)
                return typeof(TypedPhone);
            return typeof(Phone);
        }
    }
}
