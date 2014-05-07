using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace StreamEnergy.MyStream.Models.Angular.GridTable
{
    public static class GridTableExtensions
    {
        public static IEnumerable<Column> BuildTableSchema(this Type type)
        {
            return from member in type.GetProperties().OfType<MemberInfo>().Concat(type.GetFields())
                   let attr = member.GetCustomAttribute<ColumnSchemaAttribute>()
                   where attr != null
                   select new Column
                   {
                       Field = Json.GetJsonPropertyName(member),
                       DisplayName = attr.DisplayNameField, // TODO - Sitecore translate
                       Hide = attr.HideFor,
                       IsVisible = attr.IsVisible
                   };
        }
    }
}