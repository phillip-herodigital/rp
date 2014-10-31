using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;
using CsvHelper;
using Microsoft.Practices.Unity;
using StackExchange.Redis;
using StreamEnergy.DomainModels.Accounts.Create;
using StreamEnergy.Logging;
using StreamEnergy.Services.Clients;
using StreamEnergy.Unity;

namespace Cis2AureaAccountImport
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
                    new FakeLocationAdapter()
                }));
            ((IContainerSetupStrategy)new StreamEnergy.Services.Clients.StreamConnectContainerSetup()).SetupUnity(container);
            ((IContainerSetupStrategy)new StreamEnergy.Services.Clients.ClientContainerSetup()).SetupUnity(container);

            var accountService = container.Resolve<StreamEnergy.DomainModels.Accounts.IAccountService>();
            var membership = container.Resolve<MembershipBuilder>();

            var usernameRecords = LoadRecords<UsernameRecord>(options.UsernameMapping);
            var accountRecords = LoadRecords<AccountRecord>(options.AccountMapping);

            var users = (from user in usernameRecords
                         where !string.IsNullOrEmpty(user.Email)
                         join account in accountRecords on user.Profile equals account.CIS2AccountNumber
                         group account.AureaAccountNumber by new { Username = user.UserID, Email = user.Email } into set
                         select new { set.Key.Username, set.Key.Email, AccountNumbers = set.ToArray() }).ToArray();

            foreach (var entry in users.Select((e, index) => new { index , e }))
            {
                if (Membership.GetUser(prefix + entry.e.Username) != null)
                    continue;

                var accounts = Task.WhenAll(entry.e.AccountNumbers.Select(accountNumber => accountService.GetAccountDetails(accountNumber)).ToArray())
                    .Result.Where(acct => acct != null);

                if (accounts.Any())
                {
                    var customerIdTask = membership.CreateUser(prefix + entry.e.Username, email: entry.e.Email)
                        .ContinueWith(profileTask => 
                            {
                                profileTask.Result.ImportSource = StreamEnergy.DomainModels.Accounts.ImportSource.GeorgiaAccounts;
                                profileTask.Result.Save();
                                return profileTask.Result.GlobalCustomerId;
                            });

                    var associationTask = Task.WhenAll(accounts.Select(acct => customerIdTask.ContinueWith(cidTask => accountService.AssociateAccount(cidTask.Result, acct.AccountNumber, acct.Details.SsnLastFour, ""))));
                    associationTask.Wait();

                    Console.WriteLine("{0}%  of {2} - {1}", (entry.index * 100 / users.Length), entry.e.Username, users.Length);
                }
            }
        }

        private static IEnumerable<T> LoadRecords<T>(string file)
        {
            using (var reader = new StreamReader(file))
            {
                var csv = new CsvReader(reader);
                csv.Configuration.AutoMap<T>();
                return csv.GetRecords<T>().ToList();
            }
        }
    }
}
