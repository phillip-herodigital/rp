using System;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.IO;
using Newtonsoft.Json.Converters;

namespace StreamEnergy.Mvc
{
    public class JsonNetFormatter : MediaTypeFormatter
    {
        private JsonSerializerSettings settings;

        public JsonNetFormatter(JsonSerializerSettings settings = null)
        {
            this.settings = settings ?? Json.StandardFormatting;
            SupportedMediaTypes.Add(new System.Net.Http.Headers.MediaTypeHeaderValue("application/json"));
        }

        public override bool CanReadType(Type type)
        {
            return true;
        }

        public override bool CanWriteType(Type type)
        {
            return true;
        }

        public override Task<object> ReadFromStreamAsync(Type type, Stream readStream, System.Net.Http.HttpContent content, IFormatterLogger formatterLogger)
        {
            var task = Task<object>.Factory.StartNew(() =>
            {
                var sr = new StreamReader(readStream);
                var jreader = new JsonTextReader(sr);

                var ser = JsonSerializer.Create(settings);
                ser.Converters.Add(new IsoDateTimeConverter());

                object val = ser.Deserialize(jreader, type);
                return val;
            });

            return task;
        }

        public override Task WriteToStreamAsync(Type type, object value, Stream writeStream, System.Net.Http.HttpContent content, System.Net.TransportContext transportContext)
        {
            var task = Task.Factory.StartNew(() =>
            {
                string json = JsonConvert.SerializeObject(value, settings);

                byte[] buf = System.Text.Encoding.Default.GetBytes(json);
                writeStream.Write(buf, 0, buf.Length);
                writeStream.Flush();
            });

            return task;
        }
    }
}
