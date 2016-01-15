using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json.Linq;

namespace StreamEnergy.Logging
{
    public class XmlToJsonConverter
    {
        const string xmlSchemaNs = "http://www.w3.org/2001/XMLSchema-instance";

        public static JToken Convert(string messageString)
        {
            if (messageString != null)
            {
                var doc = new System.Xml.XmlDocument();
                doc.LoadXml(messageString);
                var json = Newtonsoft.Json.JsonConvert.SerializeXmlNode(doc, Newtonsoft.Json.Formatting.Indented);
                var token = JToken.Parse(json);
                return Update(token);
            }
            return null;
        }

        private static JToken Update(Newtonsoft.Json.Linq.JToken token, Dictionary<string, string> namespaces = null)
        {
            if (token is JObject)
            {
                var jObject = token as JObject;
                var ns = namespaces;
                if (jObject.Properties().Any(p => p.Name.StartsWith("@xmlns:")))
                {
                    if (namespaces == null)
                        ns = new Dictionary<string, string>();
                    else
                        ns = new Dictionary<string, string>(namespaces);

                    var xmlnsProps = jObject.Properties().Where(p => p.Name.StartsWith("@xmlns")).ToArray();
                    foreach (var prop in xmlnsProps)
                    {
                        if (prop.Name.Length > 7)
                        {
                            ns[prop.Name.Substring(7)] = prop.Value.ToString();
                        }
                        jObject.Remove(prop.Name);
                    }
                }
                if (ns == null)
                    ns = new Dictionary<string, string>();

                var properties = jObject.Properties().ToArray();
                foreach (var property in properties)
                {
                    var name = property.Name;
                    var shortName = name;
                    if (name.StartsWith("@"))
                    {
                        name = name.Substring(1);
                    }
                    if (name.Contains(":"))
                    {
                        var parts = name.Split(':');
                        string targetNs = "";
                        if (ns.ContainsKey(parts[0]))
                            targetNs = ns[parts[0]];
                        else
                            targetNs = property.Value["@xmlns:" + parts[0]].Value<string>();
                        name = targetNs + ":" + parts[1];
                        shortName = parts[1];
                    }
                    if (name == xmlSchemaNs + ":nil" && property.Value.ToString() == "true")
                    {
                        return null;
                    }
                    jObject.Remove(property.Name);
                    jObject[shortName] = Update(property.Value, ns);
                }
                return jObject;
            }
            else if (token is JValue)
            {
                return token;
            }
            else if (token is JArray)
            {
                foreach (var entry in (JArray)token)
                {
                    Update(entry, namespaces);
                }
                return token;
            }
            else
            {
                // TODO
                return null;
            }
        }
    }
}
