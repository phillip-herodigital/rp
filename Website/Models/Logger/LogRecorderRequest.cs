using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ResponsivePath.Logging;

namespace StreamEnergy.MyStream.Models.Logger
{
    public class LogRecorderRequest
    {
        public string Message { get; set; }
        public Severity Severity { get; set; }
        public dynamic Data { get; set; }
    }
}