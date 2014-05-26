using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy
{
    public class TypeIndicatorLookup<TSuper, TSample> : ITypeIndicatorLookup
        where TSample : class, TSuper
    {
        private readonly Func<TSuper, string> getQualifier;

        public TypeIndicatorLookup(Func<TSuper, string> getQualifier)
        {
            this.getQualifier = getQualifier;
            this.SupportedTypes = new Dictionary<string, Type>();
        }

        public Dictionary<string, Type> SupportedTypes { get; private set; }


        public Type SuperType
        {
            get { return typeof(TSuper); }
        }

        public Type FindMatch(JObject data)
        {
            var sample = Newtonsoft.Json.JsonSerializer.Create(Json.StandardFormatting).Deserialize<TSample>(data.CreateReader());
            if (sample != null)
            {
                var value = getQualifier(sample);
                if (SupportedTypes.ContainsKey(value))
                    return SupportedTypes[value];
            }
            return null;
        }
    }
}
