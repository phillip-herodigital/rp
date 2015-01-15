using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;
using Microsoft.Practices.Unity;
using StackExchange.Redis;
using StreamEnergy.DomainModels.Accounts.Create;
using StreamEnergy.Logging;
using StreamEnergy.Services.Clients;
using StreamEnergy.Unity;

namespace StreamEnergy.UserMigration.Kubra
{
    class Program
    {
        const string prefix = "extranet\\";
        private readonly MembershipBuilder membership;

        public Program(MembershipBuilder membership)
        {
            this.membership = membership;
        }

        static void Main(string[] args)
        {
            var options = new Options();
            if (!CommandLine.Parser.Default.ParseArguments(args, options))
            {
                return;
            }

            var container = new UnityContainer();
            container.RegisterInstance<MembershipProvider>(Membership.Provider);
            container.RegisterType<ILogger, SimpleLogger>();
            container.RegisterType<IDatabase, SimpleStringRedisFake>();
            container.RegisterType<ISet<ILocationAdapter>>(new ContainerControlledLifetimeManager(), new InjectionFactory(uc => new HashSet<ILocationAdapter>
                {
                }));
            ((IContainerSetupStrategy)new StreamEnergy.Services.Clients.StreamConnectContainerSetup()).SetupUnity(container);
            ((IContainerSetupStrategy)new StreamEnergy.Services.Clients.ClientContainerSetup()).SetupUnity(container);

            container.Resolve<Program>().Run();
        }

        private void Run()
        {
            var users = LoadRecords().ToArray();

            foreach (var entry in users.Select((e, index) => new { index, e }))
            {
                ImportUser(entry.e).Wait();

                Console.WriteLine("{0}% of {2} - {1}", (entry.index * 100 / users.Length), entry.e.Username, users.Length);
            }
        }

        private async Task ImportUser(UserRecord userRecord)
        {
            try
            {
                if (Membership.GetUser(prefix + userRecord.Username) != null)
                {
                    await MarkComplete(userRecord, usernameCollision: true);
                }
                else
                {

                    var userProfile = await membership.CreateUser(prefix + userRecord.Username, globalCustomerId: userRecord.GlobalCustomerId);

                    userProfile.ImportSource = StreamEnergy.DomainModels.Accounts.ImportSource.KubraAccounts;
                    userProfile.Save();

                    await MarkComplete(userRecord, usernameCollision: false);
                }
            }
            catch
            {
                MarkComplete(userRecord, otherError: true).Wait();
            }
        }

        private IEnumerable<UserRecord> LoadRecords()
        {
            using (var db = new System.Data.SqlClient.SqlConnection(ConfigurationManager.ConnectionStrings["kubraImportList"].ConnectionString))
            using (var command = new System.Data.SqlClient.SqlCommand(@"
SELECT [ID]
      ,[GlobalCustomerId]
      ,[EmailAddress]
      ,[KubraUsername]
  FROM [dbo].[Customer]
WHERE [PortalImportStatus] IS NULL
", db))
            {
                db.Open();
                using (var reader = command.ExecuteReader())
                {
                    List<UserRecord> result = new List<UserRecord>();
                    while (reader.Read())
                    {
                        result.Add(new UserRecord
                            {
                                Id = Convert.ToInt32(reader["ID"]),
                                GlobalCustomerId = (Guid)reader["GlobalCustomerId"],
                                EmailAddress = (string)reader["EmailAddress"],
                                Username = (string)reader["KubraUsername"],
                            });
                    }
                    return result;
                }
            }
        }

        private async Task MarkComplete(UserRecord userRecord, bool usernameCollision = false, bool otherError = false)
        {
            // TODO - load from database
            using (var db = new System.Data.SqlClient.SqlConnection(ConfigurationManager.ConnectionStrings["kubraImportList"].ConnectionString))
            using (var command = new System.Data.SqlClient.SqlCommand(@"
UPDATE [dbo].[Customer]
   SET [PortalImportStatus] = @importStatus
      ,[PortalUsernameConflict] = @usernameConflict
 WHERE Id=@id
", db))
            {
                await db.OpenAsync();

                command.Parameters.Add("@importStatus", System.Data.SqlDbType.NVarChar).Value = (usernameCollision || otherError) ? "Error" : "Success";
                command.Parameters.Add("@usernameConflict", System.Data.SqlDbType.NVarChar).Value = usernameCollision ? "Y" : "N";
                command.Parameters.Add("@id", System.Data.SqlDbType.Int).Value = userRecord.Id;

                await command.ExecuteNonQueryAsync();
            }
        }

    }
}
