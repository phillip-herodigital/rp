using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Newtonsoft.Json;
using Sitecore.Data.Items;

namespace StreamEnergy.Logging
{
    class SqlLogRecorder : ILogRecorder
    {
        private readonly string connectionString;
        private Severity minSeverity;

        public SqlLogRecorder([Dependency("settings")]Item settingsItem)
        {
            connectionString = Sitecore.Configuration.Settings.GetConnectionString(settingsItem["ConnectionStringName"]);
            minSeverity = (Severity)Enum.Parse(typeof(Severity), settingsItem["Min Logging Level"]);
        }

        async Task ILogRecorder.Save(LogEntry logEntry)
        {
            if (logEntry.Severity < minSeverity)
            {
                return;
            }

            await Task.Yield();

            using (var connection = new SqlConnection(connectionString))
            using (var cmdCreateEntry = new SqlCommand(@"
INSERT INTO Entries (Timestamp, Severity, Message, Exception, Data)
VALUES (@timestamp, @severity, @message, @exception, @data);
SELECT SCOPE_IDENTITY();
", connection)
 {
     Parameters = 
     { 
        new SqlParameter("@timestamp", logEntry.Timestamp), 
        new SqlParameter("@severity", logEntry.Severity.ToString("g")),
        new SqlParameter("@message", logEntry.Message ?? (object)DBNull.Value),
        new SqlParameter("@exception", JsonEncode(logEntry.Exception) ?? (object)DBNull.Value),
        new SqlParameter("@data", JsonEncode(logEntry.Data) ?? (object)DBNull.Value),
     }
 })
            using (var cmdCreateIndex = new SqlCommand(@"
INSERT INTO EntryIndexes ([EntryId], [Key], [Value])
VALUES (@entryid, @key, @value);
", connection) 
 { 
     Parameters = 
     { 
         new SqlParameter("@entryid", null),
         new SqlParameter("@key", null),
         new SqlParameter("@value", null),
     } 
 })
            {
                connection.Open();
                var entryId = Convert.ToInt32(await cmdCreateEntry.ExecuteScalarAsync().ConfigureAwait(false));

                cmdCreateIndex.Parameters["@entryid"].Value = entryId;
                foreach (var index in from key in logEntry.Indexes.AllKeys
                                        from value in logEntry.Indexes.GetValues(key)
                                        select new { key, value })
                {
                    cmdCreateIndex.Parameters["@key"].Value = index.key;
                    cmdCreateIndex.Parameters["@value"].Value = index.value;

                    cmdCreateIndex.ExecuteNonQuery();
                }
            }
        }

        private string JsonEncode(object data)
        {
            if (data == null)
                return null;
            return JsonConvert.SerializeObject(data);
        }
    }
}
