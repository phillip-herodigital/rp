using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CsvHelper;
using Microsoft.Practices.Unity;
using StreamEnergy.DomainModels.Activation;

namespace StreamEnergy.Data.Activation
{
    //     
    // CREATE TABLE [dbo].[Activation](
    // 	[ActivationCode] [varchar](50) NOT NULL,
    // 	[ESN] [varchar](50) NOT NULL,
    //  CONSTRAINT [PK_Activation] PRIMARY KEY CLUSTERED 
    // (
    // 	[ActivationCode] ASC
    // )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    // ) ON [PRIMARY]
    // 
    class ActivationCodeLookup : IActivationCodeLookup
    {
        public const string SqlConnectionString = "ActivationCodeLookup.ConnectionString";
        private readonly string connectionString;

        public ActivationCodeLookup([Dependency(SqlConnectionString)] string connectionString)
        {
            this.connectionString = connectionString;
        }

        async Task<string> IActivationCodeLookup.LookupEsn(string activationCode)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                return await LookupEsn(activationCode, connection);
            }
        }

        private static async Task<string> LookupEsn(string activationCode, SqlConnection connection)
        {
            using (var cmd = new SqlCommand(@"
SELECT [ESN]
  FROM [AccessCodes].[dbo].[Activation]
WHERE [ActivationCode]=@activationCode", connection)
            {
                Parameters = { new SqlParameter("@activationCode", activationCode) }
            })
            {
                return await cmd.ExecuteScalarAsync() as string;
            }
        }


        async Task<bool> IActivationCodeLookup.UploadCsv(string csvContent)
        {
            using (var connection = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(@"
INSERT INTO [AccessCodes].[dbo].[Activation] ([ActivationCode], [ESN])
VALUES (@activationCode, @esn)", connection)
            {
                Parameters = 
                { 
                    new SqlParameter("@activationCode", null), 
                    new SqlParameter("@esn", null) 
                },
            })
            using (var textReader = new StringReader(csvContent))
            using (var csv = new CsvReader(textReader) { Configuration = { HasHeaderRecord = false } })
            {
                await connection.OpenAsync();
                while (csv.Read())
                {
                    if (await LookupEsn(csv.GetField(0), connection) != csv.GetField(1))
                    {
                        cmd.Parameters["@activationCode"].Value = csv.GetField(0);
                        cmd.Parameters["@esn"].Value = csv.GetField(1);
                        await cmd.ExecuteNonQueryAsync();
                    }
                }
            }

            return true;
        }
    }
}
