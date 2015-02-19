using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using StreamEnergy.DomainModels.Activation;

namespace StreamEnergy.Data.Activation
{
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
            using (var cmd = new SqlCommand(@"
SELECT [ESN]
  FROM [AccessCodes].[dbo].[Activation]
WHERE [ActivationCode]=@activationCode", connection)
                                       {
                                           Parameters = { new SqlParameter("@activationCode", activationCode) }
                                       })
            {
                await connection.OpenAsync();

                return await cmd.ExecuteScalarAsync() as string;
            }
        }


        async Task<bool> IActivationCodeLookup.UploadCsv(string csv)
        {
            await Task.Yield();

            return false;
        }
    }
}
