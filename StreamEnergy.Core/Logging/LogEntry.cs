using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;

namespace StreamEnergy.Logging
{
    public class LogEntry
    {
        public LogEntry()
        {
            Timestamp = DateTime.Now;
            Data = new Dictionary<string, object>();
            Indexes = new NameValueCollection();
        }

        public DateTime Timestamp { get; set; }
        public Severity Severity { get; set; }
        public string Message { get; set; }
        public Exception Exception { get; set; }

        public IDictionary<string, object> Data { get; private set; }
        public NameValueCollection Indexes { get; set; }
    }
}
