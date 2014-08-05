using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Sitecore.Data.Items;

namespace StreamEnergy.Logging
{
    public class PathedIndexer : ILogIndexer
    {
        private readonly System.Collections.Specialized.NameValueCollection paths;

        public PathedIndexer([Dependency("settings")]Item settingsItem)
        {
            paths = ((Sitecore.Data.Fields.NameValueListField)settingsItem.Fields["Indexes"]).NameValues;
        }

        public Task IndexData(LogEntry logEntry)
        {
            var jsonTokenized = JToken.Parse(JsonConvert.SerializeObject(logEntry));
            foreach (var indexKey in paths.AllKeys)
            {
                foreach (var path in paths.GetValues(indexKey))
                {
                    try
                    {
                        var values = jsonTokenized.SelectTokens(System.Web.HttpUtility.UrlDecode(path), false);
                        foreach (var value in values)
                        {
                            logEntry.Indexes.Add(indexKey, value.ToString());
                        }
                    }
                    catch { }
                }
            }
            return Task.FromResult<object>(null);
        }
    }
}
