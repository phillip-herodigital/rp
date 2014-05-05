using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy
{
    public static class Json
    {
        public static string Stringify(object target)
        {
            return JsonConvert.SerializeObject(target, StandardFormatting);
        }

        public static JsonSerializerSettings StandardFormatting
        {
            get
            {
                return new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore,
                        ContractResolver = new CamelCasePropertyNamesContractResolver(),
                        Converters = 
                        {
                            new IsoDateTimeConverter()
                        }
                    };
            }
        }
    }
}
