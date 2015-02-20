using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace StreamEnergy.Logging
{
    class LogReader : ILogReader
    {
        async Task<IEnumerable<LogEntry>> ILogReader.LoadLogs(DateTime minDate, System.Collections.Specialized.NameValueCollection indexes)
        {               
            using (SqlConnection connection = new SqlConnection(Sitecore.Configuration.Settings.GetConnectionString("log")))
            using (SqlCommand cmd = connection.CreateCommand())
            {
                cmd.Parameters.AddWithValue("@minTime", minDate);
                cmd.CommandText = @"
DECLARE @minEntryId int;

SELECT Top 1 @minEntryId = entityId
From Entries
Where Timestamp >= @minTime
Order By Timestamp ASC

SELECT TOP 1000 
    Timestamp, Exception, Message, Severity, Data
FROM Entries e
" + IndexString(cmd, indexes, "e.EntityId") + @"
WHERE e.EntityId >= @minEntryId
ORDER BY EntityId ASC
";
                await connection.OpenAsync();

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    var entries = new List<LogEntry>();
                    while (reader.Read())
                    {
                        var logEntry = new LogEntry()
                        {
                            Timestamp = Convert.ToDateTime(reader["Timestamp"]),
                            Message = Convert.ToString(reader["Message"]),
                            Exception = reader["Exception"] is DBNull ? null : JsonConvert.DeserializeObject<Exception>(Convert.ToString(reader["Exception"])),
                            Severity = (Severity)Enum.Parse(typeof(Severity), Convert.ToString(reader["Severity"]), true),
                        };
                        using (var sr = new System.IO.StringReader(Convert.ToString(reader["Data"])))
                        {
                            new JsonSerializer().Populate(sr, logEntry.Data);
                        }
                        entries.Add(logEntry);
                    }
                    return entries;
                }
            }
        }

        private string IndexString(SqlCommand cmd, System.Collections.Specialized.NameValueCollection indexes, string pk)
        {
            var joins = new List<string>();

            for (var keyIndex = 0; keyIndex < indexes.Keys.Count; keyIndex++)
            {
                cmd.Parameters.AddWithValue("@k" + keyIndex, indexes.Keys[keyIndex]);
                var values = indexes.GetValues(indexes.Keys[keyIndex]);
                for (var valueIndex = 0; valueIndex < values.Length; valueIndex++)
                {
                    var keyValueName = keyIndex + "_" + valueIndex;
                    cmd.Parameters.AddWithValue("@v" + keyValueName, values[valueIndex]);
                    joins.Add("INNER JOIN [EntryIndexes] t" + keyValueName + " ON " + pk + " = t" + keyValueName + ".EntryId AND t" + keyValueName + ".[Key] = @k" + keyIndex + " AND t" + keyValueName + ".Value = @v" + keyValueName);
                }
            }

            return string.Join(Environment.NewLine, joins);
        }


        async Task<IEnumerable<string>> ILogReader.GetIndexedKeys()
        {
            using (SqlConnection connection = new SqlConnection(Sitecore.Configuration.Settings.GetConnectionString("log")))
            using (SqlCommand cmd = connection.CreateCommand())
            {
                cmd.CommandText = @"
SELECT [Key]
From EntryIndexes
Group by [Key]
";
                await connection.OpenAsync();

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    var entries = new List<string>();
                    while (reader.Read())
                    {
                        entries.Add(Convert.ToString(reader["Key"]));
                    }
                    return entries;
                }
            }
        }

        async Task<IEnumerable<string>> ILogReader.SearchIndexedValues(string key, string valueStartsWith)
        {
            using (SqlConnection connection = new SqlConnection(Sitecore.Configuration.Settings.GetConnectionString("log")))
            using (SqlCommand cmd = connection.CreateCommand())
            {
                cmd.CommandText = @"
SELECT [Value]
From EntryIndexes
Where [Key] = @key AND [Value] LIKE @valueStart
Group by [Value]
";
                cmd.Parameters.AddWithValue("@key", key);
                cmd.Parameters.AddWithValue("@valueStart", (valueStartsWith ?? "").Replace("%", "[%]") + "%");

                await connection.OpenAsync();

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    var entries = new List<string>();
                    while (reader.Read())
                    {
                        entries.Add(Convert.ToString(reader["Value"]));
                    }
                    return entries;
                }
            }
        }


        async Task<Dictionary<string, string[]>> ILogReader.LoadRelated(System.Collections.Specialized.NameValueCollection indexes)
        {
            using (SqlConnection connection = new SqlConnection(Sitecore.Configuration.Settings.GetConnectionString("log")))
            using (SqlCommand cmd = connection.CreateCommand())
            {
                await connection.OpenAsync();
                cmd.CommandText = @"
SELECT TOP 1000 
    ei.[Key], ei.Value
FROM EntryIndexes ei
" + IndexString(cmd, indexes, "ei.EntryId") + @"
GROUP BY ei.[Key], ei.Value
";

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    var entries = new Dictionary<string, List<string>>();
                    while (reader.Read())
                    {
                        var key = Convert.ToString(reader["Key"]);
                        if (!entries.ContainsKey(key))
                            entries[key] = new List<string>();
                        entries[key].Add(Convert.ToString(reader["Value"]));
                    }
                    return entries.ToDictionary(e => e.Key, e => e.Value.ToArray());
                }
            }
        }
    }
}
