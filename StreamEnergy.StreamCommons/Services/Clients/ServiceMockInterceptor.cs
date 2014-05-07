using Castle.DynamicProxy;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Description;
using System.Text;
using System.Xml;

namespace StreamEnergy.Services.Clients
{
    public class ServiceMockInterceptor : IInterceptor
    {
        void IInterceptor.Intercept(IInvocation invocation)
        {
            var result = CreateResponse("<Example xmlns=\"http://tempuri.org/\"><Gold>109</Gold><Message>StackOverflow</Message></Example>", typeof(Example));
            var request = CreateRequest(result);
            invocation.Proceed();
        }

        private string CreateRequest(object t)
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
                return tw.ToString();
            }
        }

        private object CreateResponse(string xml, Type responseType)
        {
            string action = "";
            XmlReader bodyReader = XmlReader.Create(new StringReader(xml));
            Message msg = Message.CreateMessage(MessageVersion.Default, action, bodyReader);
            TypedMessageConverter converter = TypedMessageConverter.Create(responseType, action);
            return converter.FromMessage(msg);
        }

        [MessageContract]
        public class Example
        {
            [MessageHeader]
            public string Hello;

            [MessageHeader]
            public double Value;

            [MessageBodyMember]
            public int Gold;

            [MessageBodyMember]
            public string Message;
        }
    }
}
