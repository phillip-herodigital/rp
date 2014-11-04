using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Serialization;

namespace StreamEnergy.Services.Clients.SmartyStreets
{
    public class UnderscoreMappingResolver : DefaultContractResolver
    {
        protected override string ResolvePropertyName(string propertyName)
        {
            return System.Text.RegularExpressions.Regex.Replace(propertyName, @"([A-Z])([A-Z][a-z])|([a-z0-9])([A-Z])", "$1$3_$2$4").ToLower();
        }
    }
}
