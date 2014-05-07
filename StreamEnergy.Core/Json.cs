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
        private static readonly CamelCasePropertyNamesContractResolver contractResolver = new CamelCasePropertyNamesContractResolver();

        public static string Stringify(object target)
        {
            return JsonConvert.SerializeObject(target, StandardFormatting);
        }

        public static string GetJsonPropertyName(System.Reflection.MemberInfo member)
        {
            return contractResolver.GetResolvedPropertyName(member.Name);
        }

        public static JsonSerializerSettings StandardFormatting
        {
            get
            {
                return new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore,
                        ContractResolver = contractResolver,
                        Converters = 
                        {
                            new IsoDateTimeConverter(),
                            new StringEnumConverter() { CamelCaseText = true }
                        }
                    };
            }
        }
    }
}
