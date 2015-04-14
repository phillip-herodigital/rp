using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using StreamEnergy.Logging;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    [RoutePrefix("api/logViewer")]
    public class LogViewerController : ApiController
    {
        private ILogReader reader;

        public LogViewerController(EnvironmentCategory environment, ILogReader reader)
        {
            if (environment == EnvironmentCategory.Production)
            {
                throw new NotSupportedException();
            }
            this.reader = reader;
        }

        [HttpPost]
        [Route("logs")]
        public async Task<IEnumerable<object>> LoadLogs(Dictionary<string, string[]> indexValues)
        {
            var indexes = new NameValueCollection();
            foreach (var key in indexValues.Keys)
            {
                foreach (var value in indexValues[key])
                {
                    indexes.Add(key, value);
                }
            }
            return from logEntry in await reader.LoadLogs(DateTime.Today.AddDays(-30), indexes)
                   select new
                   {
                       Message = logEntry.Message,
                       Severity = logEntry.Severity,
                       Exception = logEntry.Exception,
                       Data = logEntry.Data,
                       Timestamp = logEntry.Timestamp,
                       Indexes = logEntry.Indexes.Keys.OfType<string>().ToDictionary(key => key, key => logEntry.Indexes.GetValues(key)).ToArray()
                   };
        }

        [HttpPost]
        [Route("related")]
        public async Task<KeyValuePair<string, string[]>[]> LoadRelated(Dictionary<string, string[]> indexValues)
        {
            var indexes = new NameValueCollection();
            foreach (var key in indexValues.Keys)
            {
                foreach (var value in indexValues[key])
                {
                    indexes.Add(key, value);
                }
            }
            return (await reader.LoadRelated(indexes)).ToArray();
        }

        [HttpGet]
        [Route("indexes")]
        public async Task<IEnumerable<string>> GetKeys()
        {
            return await reader.GetIndexedKeys();
        }

        [HttpGet]
        [Route("indexes/{key}")]
        public async Task<IEnumerable<string>> GetKeys(string key, string startsWith)
        {
            return await reader.SearchIndexedValues(key, startsWith);
        }
    }
}
