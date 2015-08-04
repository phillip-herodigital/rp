using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CsvHelper;
using Microsoft.Practices.Unity;
using StreamEnergy.DomainModels.Associate;

namespace StreamEnergy.Data.Associate
{
    class AssociateLookup : IAssociateLookup
    {
        public const string SqlConnectionString = "Eagle.ConnectionString";
        private readonly string connectionString;

        public AssociateLookup([Dependency(SqlConnectionString)] string connectionString)
        {
            this.connectionString = connectionString;
        }

        async Task<AssociateInformation> IAssociateLookup.LookupAssociate(string associateId)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    return await LookupAssociate(associateId, connection);
                }
            }
            catch
            {
                return null;
            }
        }

        private static async Task<AssociateInformation> LookupAssociate(string associateId, SqlConnection connection)
        {
            using (var cmd = new SqlCommand(@"
SELECT
  h.[WebAlias],
  h.[Site IA Name],
  ah.[IA Level]
FROM [Eagle].[dbo].[tblHomesites] h
LEFT JOIN [Eagle].[dbo].[tblAssociatesAndHomesites] ah ON ah.[IA Number] = h.[IA Number]
WHERE h.[IA Number] = @associateId", connection)
            {
                Parameters = { new SqlParameter("@associateId", associateId) }
            })
            {
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        return new AssociateInformation()
                        {
                            WebAlias = reader.GetFieldValue<string>(0),
                            AssociateName = reader.GetFieldValue<string>(1),
                            AssociateLevel = reader.GetFieldValue<string>(2),
                        };
                    }
                }
                return null;
            }
        }
    }
}
