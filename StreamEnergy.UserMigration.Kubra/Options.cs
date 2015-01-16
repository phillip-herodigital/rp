using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CommandLine;

namespace StreamEnergy.UserMigration.Kubra
{
    class Options
    {
        [Option('r', "retry", Required = false, HelpText = "Specifies whether to retry errored (but not conflicted) accounts")]
        public bool Retry { get; set; }

        [Option('i', "id", Required = false, HelpText = "Specifies a single record to run")]
        public string SingleRecord { get; set; }
    }
}
