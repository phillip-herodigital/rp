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

    public class TypeIndicatorLookup<TSuper, TSample, TConcrete>
        where TSample : class, TSuper
        where TConcrete : TSuper
    {
        public TypeIndicatorLookup()
        {
        }

        private bool CheckMatch(Newtonsoft.Json.Linq.JObject obj)
        {
            var sample = Newtonsoft.Json.JsonSerializer.Create(Json.StandardFormatting).Deserialize<TSample>(obj.CreateReader());
            if (sample != null)
                return IsMatch(sample);

            return false;
        }

        public Predicate<TSample> IsMatch { get; set; }

        public static implicit operator TypeIndicatorLookup(TypeIndicatorLookup<TSuper, TSample, TConcrete> target)
        {
            return new TypeIndicatorLookup()
            {
                SuperType = typeof(TSuper),
                Concrete = typeof(TConcrete),
                IsMatch = target.CheckMatch
            };
        }

    }
}
