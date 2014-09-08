﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using SmartyStreets = StreamEnergy.Services.Clients.SmartyStreets;

namespace StreamEnergy.LuceneServices.IndexGeneration
{
    class Program
    {
        const int reportEvery = 10000;
        const int maxTasks = 5000;

        static void Main(string[] args)
        {
            var container = StreamEnergy.Unity.Container.Instance.Unity;
            var options = new Options();
            if (!CommandLine.Parser.Default.ParseArguments(args, options))
            {
                return;
            }

            var unityContainer = new UnityContainer();
            new CoreContainerSetup().SetupUnity(unityContainer);
            new StreamEnergy.Services.Clients.ClientContainerSetup().SetupUnity(unityContainer);

            using (var directoryLoader = new Ercot.DirectoryLoader())
            using (var indexBuilder = new IndexBuilder(options.Destination, options.ForceCreate))
            {
                var streetService = unityContainer.Resolve<SmartyStreets.SmartyStreetService>();
                var results = directoryLoader.Load(options.Source, options.StartDate, true);
                var allTasks = new List<Task<Dictionary<string, DomainModels.IServiceCapability>>>();
                foreach (var tdu in results.GroupBy(file => file.Tdu))
                {
                    var copy = tdu; // grab the proper closure, since var tdu is technically outside the loop
                    allTasks.Add(IndexTdu(streetService, indexBuilder, tdu, options.ForceCreate));
                }

                var tasks = allTasks.ToArray();
                Task.WaitAll(tasks);
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
                Task.WaitAll(zipTasks);

                Console.WriteLine("Optimizing");
                indexBuilder.Optimize().Wait();
            }
        }

        private static async Task<Dictionary<string, DomainModels.IServiceCapability>> IndexTdu(SmartyStreets.SmartyStreetService streetService, IndexBuilder indexBuilder, IGrouping<string, Ercot.FileMetadata> tdu, bool isFresh)
        {
            try
            {
                await Task.Yield();
                Dictionary<string, DomainModels.IServiceCapability> zipCodes = new Dictionary<string, DomainModels.IServiceCapability>();
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
                        foreach (var loc in new ErcotAddressReader(streetService: streetService, fileReader: fr, fileStream: fs, tdu: file.Tdu).Addresses)
                        {
                            if (!zipCodes.ContainsKey(loc.Item1.Address.PostalCode5))
                            {
                                zipCodes.Add(loc.Item1.Address.PostalCode5, new DomainModels.Enrollments.TexasServiceCapability { Tdu = tdu.Key, MeterType = DomainModels.Enrollments.TexasMeterType.Other });
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
    }
}
