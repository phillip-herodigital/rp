using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CommandLine;

namespace Cis2AureaAccountImport
{
    class Options
    {
        [Option('u', "users", Required = true, HelpText = "Username account file: SE_GA_EnrolledAccountsEmailAndDistributorAdded.csv")]
        public string UsernameMapping { get; set; }

        [Option('a', "accounts", Required = true, HelpText = "Account file: CIS2_Aurea_accounts_UA_20141021.csv")]
        public string AccountMapping { get; set; }
    }
}
