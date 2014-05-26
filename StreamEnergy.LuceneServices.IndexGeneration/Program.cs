using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.LuceneServices.IndexGeneration
{
    class Program
    {
        static void Main(string[] args)
        {
            var container = StreamEnergy.Unity.Container.Instance.Unity;
            var options = new Options();
            if (!CommandLine.Parser.Default.ParseArguments(args, options))
            {
                return;
            }

            throw new NotImplementedException();
        }
    }
}
