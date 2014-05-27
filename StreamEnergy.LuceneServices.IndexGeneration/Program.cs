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
            using (var indexBuilder = new IndexBuilder(options.Destination))
            {
                var results = directoryLoader.Load(options.Source);
                var allTasks = new List<Task>();
                foreach (var tdu in directoryLoader.Load(options.Source).GroupBy(file => file.Tdu))
                {
                    var copy = tdu; // grab the proper closure, since var tdu is technically outside the loop
                    allTasks.Add(IndexTdu(indexBuilder, tdu));
                }

                var tasks = allTasks.ToArray();
                Task.WaitAll(tasks);
                indexBuilder.Optimize().Wait();
            }
        }

        const int reportEvery = 10000;
        const int maxTasks = 5000;
        private static async Task IndexTdu(IndexBuilder indexBuilder, IGrouping<string, Ercot.FileMetadata> tdu)
        {
            try
            {
                await Task.Yield();
                int counter = 0;
                Queue<Task> taskQueue = new Queue<Task>(maxTasks);
                foreach (var file in tdu)
                {
                    using (var fs = System.IO.File.OpenRead(file.FullPath))
                    using (var fr = new Ercot.FileReader())
                    {
                        foreach (var loc in fr.ReadZipFile(fs, file.Tdu))
                        {
                            taskQueue.Enqueue(indexBuilder.WriteLocation(loc));
                            if (taskQueue.Count >= maxTasks)
                            {
                                Task.WaitAll(taskQueue.ToArray());
                                taskQueue.Clear();
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
                }
                Task.WaitAll(taskQueue.ToArray());
                taskQueue.Clear();
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
