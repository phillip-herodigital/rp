using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using StreamEnergy.Logging;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers
{
    public class DebuggingController : Controller
    {
        public DebuggingController()
        {
            
        }

        public ActionResult LogViewer()
        {
            var results = new List<LogEntry>();

            using (SqlConnection connection = new SqlConnection(Sitecore.Configuration.Settings.GetConnectionString("log")))
            {
                connection.Open();

                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandText = @"SELECT TOP 1000 
    Timestamp, Exception, Message, Severity, Data
FROM [MyStreamSitecore_Log].[dbo].[EntryIndexes] ei
INNER JOIN [MyStreamSitecore_Log].[dbo].Entries e ON e.EntityId = ei.EntryId
WHERE [Key] = 'SessionID' AND Value = @SessionId
ORDER BY EntityId ASC";

                    SqlParameter parameter = new SqlParameter("@SessionId", SqlDbType.VarChar);
                    parameter.Value = Request.Params["sessionID"] ?? Session.SessionID;
                    command.Parameters.Add(parameter);

                    var reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        var logEntry = new LogEntry()
                        {
                            Timestamp = reader.GetDateTime(0),
                            Exception = reader.IsDBNull(1) ? null : (Exception)JsonConvert.DeserializeObject(reader.GetString(1)),
                            Message = reader.GetString(2),
                            Severity = (Severity)Enum.Parse(typeof(Severity), reader.GetString(3), true),
                        };

                        var dict = (JObject)JsonConvert.DeserializeObject(reader.GetString(4));
                        foreach(var key in dict)
                        {
                            logEntry.Data.Add(new KeyValuePair<string, object>(key.Key, key.Value));
                        }

                        results.Add(logEntry);
                    }
                }
            }
            return View("~/Views/Pages/Debugging/LogViewer.cshtml", results);
        }
    }
}