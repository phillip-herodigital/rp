using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models
{
    public class RapidPrototyping
    {
        public static T Dummy<T>()
        {
            return (T)Dummy(typeof(T));
        }

        private static object Dummy(Type type)
        {
            if (type == typeof(string))
                return "string";
            if (type == typeof(bool))
                return true;

            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(IEnumerable<>))
            {
                var args = type.GetGenericArguments();
                var list = (System.Collections.IList)Activator.CreateInstance(typeof(List<>).MakeGenericType(args));
                var copy = Dummy(args[0]);
                list.Add(copy);
                list.Add(copy);
                list.Add(copy);
                return list;
            }

            var result = Activator.CreateInstance(type);
            foreach (var property in type.GetProperties())
            {
                property.SetValue(result, Dummy(property.PropertyType));
            }
            return result;
        }
    }
}