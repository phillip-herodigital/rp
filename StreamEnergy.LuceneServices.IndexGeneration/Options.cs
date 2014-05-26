using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CommandLine;
using CommandLine.Text;

namespace StreamEnergy.LuceneServices.IndexGeneration
{
    class Options
    {
        [Option('d', "dest", Required=true, HelpText="The destination folder for the Lucene index.")]
        public string Destination { get; set; }

        [HelpOption]
        public string GetUsage()
        {
            return HelpText.AutoBuild(this,
              (HelpText current) => HelpText.DefaultParsingErrorsHandler(this, current));
        }
    }
}
