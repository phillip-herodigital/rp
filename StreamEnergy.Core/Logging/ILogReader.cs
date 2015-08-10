﻿using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Logging;

namespace StreamEnergy.Logging
{
    public interface ILogReader
    {
        Task<IEnumerable<ReadOnlyLogEntry>> LoadLogs(DateTime minDate, NameValueCollection indexes);
        Task<IEnumerable<string>> GetIndexedKeys();
        Task<IEnumerable<string>> SearchIndexedValues(string key, string valueStartsWith = null);


        Task<Dictionary<string, string[]>> LoadRelated(NameValueCollection indexes);
    }
}
