using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel.Dispatcher;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Logging;
using StreamEnergy.Logging;

namespace StreamEnergy.Services.ServiceModel
{
    class LoggedServiceMessageInspector : IClientMessageInspector
    {
        private readonly ILogger logger;

        public LoggedServiceMessageInspector(ILogger logger)
        {
            this.logger = logger;
        }

        public object BeforeSendRequest(ref System.ServiceModel.Channels.Message request, System.ServiceModel.IClientChannel channel)
        {
            var buffer = request.CreateBufferedCopy(int.MaxValue);
            request = buffer.CreateMessage();

            var stringWriter = new StringWriter();
            var xtw = new System.Xml.XmlTextWriter(stringWriter);
            buffer.CreateMessage().WriteMessage(xtw);
            xtw.Flush();
            xtw.Close();

            return stringWriter.ToString();
        }

        public void AfterReceiveReply(ref System.ServiceModel.Channels.Message reply, object correlationState)
        {
            var buffer = reply.CreateBufferedCopy(int.MaxValue);
            reply = buffer.CreateMessage();

            var stringWriter = new StringWriter();
            var xtw = new System.Xml.XmlTextWriter(stringWriter);
            buffer.CreateMessage().WriteMessage(xtw);
            xtw.Flush();
            xtw.Close();

            var request = XmlToJsonConverter.Convert((string)correlationState);
            var response = XmlToJsonConverter.Convert(stringWriter.ToString());

            logger.Record("Wcf client message intercepted", Severity.Notice, new Dictionary<string, object>
                {
                    { 
                        "ThirdPartyWcf", 
                        new 
                        {
                            Request = request,
                            Response = response,
                            
                        } 
                    }
                });
        }
    }
}
