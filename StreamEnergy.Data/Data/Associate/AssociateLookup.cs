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
        private readonly ISitecoreAccessor sitecoreAccessor;

        public AssociateLookup([Dependency(SqlConnectionString)] string connectionString, ISitecoreAccessor sitecoreAccessor)
        {
            this.connectionString = connectionString;
            this.sitecoreAccessor = sitecoreAccessor;
        }

        AssociateInformation IAssociateLookup.LookupAssociate(string associateId)
        {
            if (string.IsNullOrEmpty(associateId) || associateId.ToLower() == "a2")
            {
                return null;
            }
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    var ret =  LookupAssociate(associateId, connection);
                    if (ret != null)
                    {
                        ret.AssociateLevel = sitecoreAccessor.GetFieldValue("/sitecore/content/Data/Taxonomy/Associate Levels/" + ret.AssociateLevel, "Display Text", ret.AssociateLevel);
                    }
                    return ret;
                }
            }
            catch
            {
                return null;
            }
        }

        private static AssociateInformation LookupAssociate(string associateId, SqlConnection connection)
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
                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new AssociateInformation()
                        {
                            WebAlias = reader.GetFieldValue<string>(0),
                            AssociateName = reader.GetFieldValue<string>(1),
                            AssociateLevel = reader.GetFieldValue<string>(2),
                            AssociateId = associateId,
                        };
                    }
                }
                return null;
            }
        }
    }
}
