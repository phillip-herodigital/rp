using Microsoft.Practices.Unity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy
{
    public class TypeIndicatorJsonConverter : JsonConverter
    {
        public TypeIndicatorJsonConverter()
        {
            TypeIndicators = new List<TypeIndicatorLookup>();
        }

        public List<TypeIndicatorLookup> TypeIndicators { get; private set; }

        public override bool CanConvert(Type objectType)
        {
            return TypeIndicators.Any(t => t.SuperType == objectType);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var target = serializer.Deserialize<Newtonsoft.Json.Linq.JObject>(reader);
            var selected = TypeIndicators.Where(t => t.SuperType == objectType).FirstOrDefault(t => t.IsMatch(target));

            return serializer.Deserialize(target.CreateReader(), selected.Concrete);
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            serializer.Serialize(writer, value);
        }
    }
}
