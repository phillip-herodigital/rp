using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Security;
using Microsoft.Practices.Unity;
using StackExchange.Redis;
using StreamEnergy.DomainModels.Accounts;
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
        private readonly IUnityContainer unityContainer;
        private readonly IAccountService accountService;

        public Program(MembershipBuilder membership, IUnityContainer unityContainer, IAccountService accountService)
        {
            this.membership = membership;
            this.unityContainer = unityContainer;
            this.accountService = accountService;
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

            container.Resolve<Program>().Run(options);
        }

        private void Run(Options options)
        {
            var users = LoadRecords(options).ToArray();
            var completedCount = 0;
            Stopwatch sw = new Stopwatch();

            Action<string> onCompleted = (string username) =>
                {
                    var temp = completedCount + 1;
                    Interlocked.Increment(ref completedCount);
                    var msPerUser = (sw.ElapsedMilliseconds) / temp;
                    DateTime target = DateTime.Now + TimeSpan.FromMilliseconds(msPerUser * (users.Length - temp));
                    Console.WriteLine("{0}% - {1} of {2} - {3}\n  Complete at {4}\n", (temp * 100 / users.Length), temp, users.Length, username, target);
                };
            List<Task> executing = new List<Task>();
            var max = int.Parse(ConfigurationManager.AppSettings["maxThreads"]);

            sw.Start();
            foreach (var entry in users.Select((e, index) => new { index, e }))
            {
                executing.Add(ImportUser(entry.e, options).ContinueWith(t => onCompleted(entry.e.Username)));

                if (executing.Count >= max)
                {
                    Task.WaitAny(executing.ToArray());
                    executing.RemoveAll(t => t.IsCompleted);
                }

                if (Console.KeyAvailable)
                {
                    break;
                }
            }

            Task.WaitAll(executing.ToArray());
        }

        private async Task ImportUser(UserRecord userRecord, Options options)
        {
            try
            {
                var user = Membership.GetUser(prefix + userRecord.Username);
                if (user != null)
                {
                    if (!options.Retry)
                    {
                        await MarkComplete(userRecord, usernameCollision: true);
                    }
                    else
                    {
                        var userProfile = UserProfile.Locate(unityContainer, prefix + userRecord.Username);
                        if (userProfile.GlobalCustomerId != Guid.Empty && userProfile.GlobalCustomerId != userRecord.GlobalCustomerId)
                        {
                            await MarkComplete(userRecord, usernameCollision: true);
                            return;
                        }

                        userProfile.GlobalCustomerId = userRecord.GlobalCustomerId;
                        userProfile.ImportSource = StreamEnergy.DomainModels.Accounts.ImportSource.KubraAccounts;
                        userProfile.Save();

                        var customer = await accountService.GetCustomerByCustomerId(userRecord.GlobalCustomerId);
                        customer.AspNetUserProviderKey = user.ProviderUserKey.ToString();
                        customer.Username = prefix + userRecord.Username;
                        customer.EmailAddress = null;
                        await accountService.UpdateCustomer(customer);

                        await MarkComplete(userRecord, usernameCollision: false);
                    }
                }
                else
                {
                    var userProfile = await membership.CreateUser(prefix + userRecord.Username, globalCustomerId: userRecord.GlobalCustomerId);

                    userProfile.ImportSource = StreamEnergy.DomainModels.Accounts.ImportSource.KubraAccounts;
                    userProfile.Save();

                    await MarkComplete(userRecord, usernameCollision: false);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                MarkComplete(userRecord, otherError: true).Wait();
            }
        }

        private IEnumerable<UserRecord> LoadRecords(Options options)
        {
            var query = @"
SELECT [ID]
      ,[GlobalCustomerId]
      ,[EmailAddress]
      ,[KubraUsername]
  FROM [dbo].[Customer]
";
            if (!options.Retry)
            {
                query += "WHERE [PortalImportStatus] IS NULL";
            }
            else
            {
                query += @"WHERE [PortalImportStatus] = 'Error'
  AND PortalUsernameConflict='N'";
            }
            if (options.SingleRecord != null)
            {
                query += "\n  AND Id=@id";
            }

            using (var db = new System.Data.SqlClient.SqlConnection(ConfigurationManager.ConnectionStrings["kubraImportList"].ConnectionString))
            using (var command = new System.Data.SqlClient.SqlCommand(query, db))
            {
                if (options.SingleRecord != null)
                {
                    command.Parameters.Add(new System.Data.SqlClient.SqlParameter("@id", int.Parse(options.SingleRecord)));
                }
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
