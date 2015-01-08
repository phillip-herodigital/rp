using System;
using System.Collections.Generic;
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

            var membership = container.Resolve<MembershipBuilder>();

            var users = LoadRecords().ToArray();


            foreach (var entry in users.Select((e, index) => new { index, e }))
            {
                if (Membership.GetUser(prefix + entry.e.Username) != null)
                    continue;

                var customerIdTask = membership.CreateUser(prefix + entry.e.Username, email: entry.e.EmailAddress, globalCustomerId: entry.e.GlobalCustomerId)
                    .ContinueWith(profileTask =>
                    {
                        profileTask.Result.ImportSource = StreamEnergy.DomainModels.Accounts.ImportSource.KubraAccounts;
                        profileTask.Result.Save();
                        return profileTask.Result;
                    });

                customerIdTask.Wait();

                Console.WriteLine("{0}% of {2} - {1}", (entry.index * 100 / users.Length), entry.e.Username, users.Length);
            }
        }

        private static IEnumerable<UserRecord> LoadRecords()
        {
            // TODO - load from database
            throw new NotImplementedException();
        }
    }
}
