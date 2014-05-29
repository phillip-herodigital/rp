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

        [Option('s', "source", Required = true, HelpText = "The source folder for the data files.")]
        public string Source { get; set; }

        [Option("mindate", HelpText = "The earliest date to process updates for - should be the last date that updates were provided.")]
        public DateTime StartDate { get; set; }

        [Option('f', "force-create", HelpText = "Forces a fresh index")]
        public bool ForceCreate { get; set; }

        [HelpOption]
        public string GetUsage()
        {
            return HelpText.AutoBuild(this,
              (HelpText current) => HelpText.DefaultParsingErrorsHandler(this, current));
        }
    }
}
