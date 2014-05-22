using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace StreamEnergy
{
    public interface ITypeIndicatorLookup
    {
        Type SuperType { get; }
        Type FindMatch(JObject data);
    }
}
