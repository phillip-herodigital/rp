using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Description;
using System.Text;
using System.Xml;


namespace StreamEnergy.Services
{
    static class SoapConverter
    {
        public static string ToSoap(object t)
        {
            string action = "";
            TypedMessageConverter converter = TypedMessageConverter.Create(t.GetType(), action);
            var msg = converter.ToMessage(t);
            XmlDocument doc = new XmlDocument();

            using (var tw = new StringWriter())
            using (var xmlWriter = XmlWriter.Create(tw))
            {
                msg.WriteBody(xmlWriter);
                xmlWriter.Flush();
                doc.LoadXml(tw.ToString());
                var nsm = new XmlNamespaceManager(doc.NameTable);
                nsm.AddNamespace("s", "http://www.w3.org/2003/05/soap-envelope");
                return doc.SelectSingleNode("//s:Body", nsm).InnerXml;
            }
        }

        public static object FromSoap(string xml, Type responseType)
        {
            string action = "";
            XmlReader bodyReader = XmlReader.Create(new StringReader(xml));
            Message msg = Message.CreateMessage(MessageVersion.Default, action, bodyReader);
            TypedMessageConverter converter = TypedMessageConverter.Create(responseType, action);
            return converter.FromMessage(msg);
        }
    }
}
