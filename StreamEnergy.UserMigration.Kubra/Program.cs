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
            if (Membership.GetUser(prefix + userRecord) != null)
            {
                await MarkComplete(userRecord, usernameCollision: true);
            }
            else
            {

                var userProfile = await membership.CreateUser(prefix + userRecord.Username, email: userRecord.EmailAddress, globalCustomerId: userRecord.GlobalCustomerId);

                userProfile.ImportSource = StreamEnergy.DomainModels.Accounts.ImportSource.KubraAccounts;
                userProfile.Save();

                await MarkComplete(userRecord, usernameCollision: false);
            }
        }

        private IEnumerable<UserRecord> LoadRecords()
        {
            // TODO - load from database
            throw new NotImplementedException();
        }

        private Task MarkComplete(UserRecord userRecord, bool usernameCollision)
        {
            // TODO - load from database
            throw new NotImplementedException();
        }

    }
}
