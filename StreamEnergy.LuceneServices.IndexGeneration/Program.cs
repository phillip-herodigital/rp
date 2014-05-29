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

            using (var directoryLoader = new Ercot.DirectoryLoader())
            using (var indexBuilder = new IndexBuilder(options.Destination, options.ForceCreate))
            {
                var results = directoryLoader.Load(options.Source, options.StartDate, true);
                var allTasks = new List<Task>();
                foreach (var tdu in results.GroupBy(file => file.Tdu))
                {
                    var copy = tdu; // grab the proper closure, since var tdu is technically outside the loop
                    allTasks.Add(IndexTdu(indexBuilder, tdu, options.ForceCreate));
                }

                var tasks = allTasks.ToArray();
                Task.WaitAll(tasks);
                Console.WriteLine("Optimizing");
                indexBuilder.Optimize().Wait();
            }
        }

        const int reportEvery = 10000;
        const int maxTasks = 5000;
        private static async Task IndexTdu(IndexBuilder indexBuilder, IGrouping<string, Ercot.FileMetadata> tdu, bool isFresh)
        {
            try
            {
                await Task.Yield();
                HashSet<string> zipCodes = new HashSet<string>();
                int counter = 0;
                Queue<Task> taskQueue = new Queue<Task>(maxTasks);
                foreach (var file in tdu)
                {
                    if (file.IsFull && !isFresh)
                    {
                        indexBuilder.ClearGroup(tdu.Key);
                        await Task.Yield();
                    }
                    using (var fs = System.IO.File.OpenRead(file.FullPath))
                    using (var fr = new Ercot.FileReader())
                    {
                        foreach (var loc in fr.ReadZipFile(fs, file.Tdu))
                        {
                            if (!zipCodes.Contains(loc.Address.PostalCode5))
                            {
                                zipCodes.Add(loc.Address.PostalCode5);
                                taskQueue.Enqueue(indexBuilder.WriteLocation(new DomainModels.Enrollments.Location
                                    {
                                        Address = new DomainModels.Address { PostalCode5 = loc.Address.PostalCode5, StateAbbreviation = loc.Address.StateAbbreviation },
                                        Capabilities = new[] { new DomainModels.TexasServiceCapability { Tdu = tdu.Key, MeterType = DomainModels.TexasMeterType.Other } },
                                    }, tdu.Key, isFresh));
                            }
                            taskQueue.Enqueue(indexBuilder.WriteLocation(loc, tdu.Key, isFresh));
                            if (taskQueue.Count >= maxTasks)
                            {
                                while (taskQueue.Any())
                                    await taskQueue.Dequeue();
                            }
                            else if (taskQueue.Count > 0 && taskQueue.Peek().IsCompleted)
                            {
                                await taskQueue.Dequeue();
                            }
                            counter++;
                            if (counter % reportEvery == 0)
                                Console.WriteLine(tdu.Key.PadRight(20) + " " + counter.ToString().PadLeft(11));
                        }
                    }
                    while (taskQueue.Any())
                        await taskQueue.Dequeue();
                    isFresh = false;
                }
                Console.WriteLine(tdu.Key.PadRight(20) + " " + counter.ToString().PadLeft(11) + " finished!");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }
    }
}
