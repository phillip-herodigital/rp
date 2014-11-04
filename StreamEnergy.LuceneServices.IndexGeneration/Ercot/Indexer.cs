using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Enrollments.TexasElectricity;
using SmartyStreets = StreamEnergy.Services.Clients.SmartyStreets;

namespace StreamEnergy.LuceneServices.IndexGeneration.Ercot
{
    class Indexer : IIndexer
    {
        private readonly List<Action> onDispose = new List<Action>();
        private int reportEvery;
        private int maxTasks;

        public Indexer(int reportEvery, int maxTasks)
        {
            this.reportEvery = reportEvery;
            this.maxTasks = maxTasks;
        }

        public async Task AddAddresses(Options options, IndexBuilder indexBuilder, SmartyStreets.SmartyStreetService streetService)
        {
            using (var directoryLoader = new Ercot.DirectoryLoader())
            {
                var results = directoryLoader.Load(options.Source, options.StartDate, true);
                var allTasks = new List<Task<Dictionary<string, DomainModels.IServiceCapability>>>();
                foreach (var tdu in results.GroupBy(file => file.Tdu))
                {
                    var copy = tdu; // grab the proper closure, since var tdu is technically outside the loop
                    allTasks.Add(IndexTdu(streetService, indexBuilder, tdu, options.ForceCreate));
                }

                var tasks = allTasks.ToArray();
                await Task.WhenAll(tasks);
                Console.WriteLine("Zips completed - adding zip codes");
                var zipTasks = (from task in tasks
                                from zip in task.Result
                                group zip.Value by zip.Key into zipCapabilities
                                from enrollmentType in new[] { DomainModels.Enrollments.EnrollmentCustomerType.Residential, DomainModels.Enrollments.EnrollmentCustomerType.Commercial }
                                select indexBuilder.WriteLocation(new DomainModels.Enrollments.Location
                                {
                                    Address = new DomainModels.Address { PostalCode5 = zipCapabilities.Key, StateAbbreviation = "TX" },
                                    Capabilities = zipCapabilities.ToArray(),
                                }, enrollmentType, "ZIP", options.ForceCreate)).ToArray();
                await Task.WhenAll(zipTasks);
            }
        }

        private async Task<Dictionary<string, DomainModels.IServiceCapability>> IndexTdu(SmartyStreets.SmartyStreetService streetService, IndexBuilder indexBuilder, IGrouping<string, Ercot.FileMetadata> tdu, bool isFresh)
        {
            try
            {
                await Task.Yield();
                Dictionary<string, DomainModels.IServiceCapability> zipCodes = new Dictionary<string, DomainModels.IServiceCapability>();
                int counter = 0;
                Queue<Task> taskQueue = new Queue<Task>(maxTasks);
                foreach (var file in tdu)
                {
                    var tduName = StandardizeTdu(file.Tdu);
                    if (tduName == null)
                        continue;
                    if (file.IsFull && !isFresh)
                    {
                        indexBuilder.ClearGroup(tdu.Key);
                        await Task.Yield();
                    }
                    using (var fs = System.IO.File.OpenRead(file.FullPath))
                    using (var fr = new Ercot.FileReader())
                    {
                        foreach (var loc in new ErcotAddressReader(streetService: streetService, fileReader: fr, fileStream: fs, tdu: tduName).Addresses)
                        {
                            if (!zipCodes.ContainsKey(loc.Item1.Address.PostalCode5))
                            {
                                zipCodes.Add(loc.Item1.Address.PostalCode5, new ServiceCapability { Tdu = tduName, MeterType = MeterType.Other });
                            }
                            taskQueue.Enqueue(indexBuilder.WriteLocation(loc.Item1, loc.Item2, tdu.Key, isFresh));
                            if (taskQueue.Count >= maxTasks)
                            {
                                while (taskQueue.Any())
                                    await taskQueue.Dequeue().ConfigureAwait(false);
                            }
                            else if (taskQueue.Count > 0 && taskQueue.Peek().IsCompleted)
                            {
                                await taskQueue.Dequeue().ConfigureAwait(false);
                            }
                            counter++;
                            if (counter % reportEvery == 0)
                                Console.WriteLine(tdu.Key.PadRight(20) + " " + counter.ToString().PadLeft(11));
                        }
                    }
                    while (taskQueue.Any())
                        await taskQueue.Dequeue().ConfigureAwait(false);
                    isFresh = false;
                }
                Console.WriteLine(tdu.Key.PadRight(20) + " " + counter.ToString().PadLeft(11) + " finished!");
                return zipCodes;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }

        private static string StandardizeTdu(string tdu)
        {
            switch (tdu)
            {
                case "SHARYLAND MCALLEN":
                    return "Sharyland McAllen";
                case "SHARYLAND UTILITIES":
                    return "Sharyland";
                case "CENTERPOINT":
                    return "Centerpoint";
                case "TNMP":
                    return "TNMP";
                case "AEP NORTH":
                    return "AEP North Texas";
                case "AEP CENTRAL":
                    return "AEP Central Texas";
                case "ONCOR ELEC":
                    return "ONCOR";
                case "SWEPCO ENERG":
                case "NUECES ELEC":
                default:
                    return null;
            }
        }

        void IDisposable.Dispose()
        {
            foreach (var action in onDispose)
            {
                action();
            }
            onDispose.Clear();
        }
    }
}
