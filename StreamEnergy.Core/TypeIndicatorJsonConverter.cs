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
            TypeIndicators = new List<ITypeIndicatorLookup>();
        }

        public List<ITypeIndicatorLookup> TypeIndicators { get; private set; }

        public override bool CanConvert(Type objectType)
        {
            return TypeIndicators.Any(t => t.SuperType == objectType);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var target = serializer.Deserialize<Newtonsoft.Json.Linq.JObject>(reader);
            var selected = (from t in TypeIndicators
                            where t.SuperType == objectType
                            select t.FindMatch(target)).FirstOrDefault();
            if (selected == objectType)
                return new JsonSerializer().Deserialize(target.CreateReader(), objectType);
            else if (selected != null)
                return serializer.Deserialize(target.CreateReader(), selected);
            else
                return null;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            serializer.Serialize(writer, value);
        }
    }
}
