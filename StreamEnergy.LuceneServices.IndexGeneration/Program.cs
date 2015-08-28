using System;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using ICSharpCode.SharpZipLib.Zip;
using log4net;
using log4net.Config;
using Lucene.Net.Store;
using Microsoft.Practices.Unity;
using StreamEnergy.LuceneServices.IndexGeneration.Aglc;
using StreamEnergy.Services.Clients;
using StreamEnergy.Services.Clients.SmartyStreets;
using StreamEnergy.Unity;
using Directory = System.IO.Directory;

namespace StreamEnergy.LuceneServices.IndexGeneration
{
    class Program
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(Program));

        const int ReportEvery = 2000;
        const int MaxTasks = 5000;

        private const string MetersAtActivePremisesCsvFilename = "Meters at Active Premises.csv";
        private const string ZipFileName = "typeahead.zip";

        private static void Main(string[] args)
        {
            XmlConfigurator.Configure();

            var options = new Options();
            if (CommandLine.Parser.Default.ParseArguments(args, options))
            {
                if (options.DownloadAglc)
                {
                    DownloadAglcArchive();
                }
                else if (options.GenerateIndex)
                {
                    GenerateIndexZip();
                }
            }
        }

        private static void GenerateIndexZip()
        {
            try
            {
                var options = new Options();
                var directoryInfo = Directory.CreateDirectory(DateTime.Now.ToString("yyyyMMddhhmm"));
                Log.Debug("Staring in " + directoryInfo.FullName);
                var ercotDownloader = new ErcotFileDownloader(directoryInfo.FullName + "\\");
                var typeaheadFolderPath = directoryInfo.FullName + "\\typeahead";
                options = new Options {Destination = typeaheadFolderPath};

                // ercot process
                Task.Run(async () =>
                {
                    Log.Debug("Starting Ercot Process..");
                    options.Region = "ercot";
                    options.ForceCreate = true;
                    options.Source = directoryInfo.FullName;
                    Log.Debug("Downloading Ercot files..");
                    await ercotDownloader.Fetch();
                    Log.Debug("Download complete.");
                    Log.Debug("Indexing ercot data...");
                    RunIndexer(options);
                    Log.Debug("Index complete.");
                    Log.Debug("Ercot Process complete.");
                }).Wait();

                // aglc process
                Task.Run(async () =>
                {
                    Log.Debug("Starting AGLC Process...");
                    if (!File.Exists(ConfigurationManager.AppSettings["MetersAtActivePremisesCsv"]))
                    {
                        throw new Exception("Meters At Address CSV file missing!");
                    }

                    var aglcDataFilePath = ConfigurationManager.AppSettings["AglcArchiveDownloadPath"] + "\\" +
                                           ConfigurationManager.AppSettings["AlgcArchiveDecryptedPath"];
                    var aglcDataFileName = ConfigurationManager.AppSettings["AglcDataFileName"];

                    if (!File.Exists(aglcDataFilePath + "\\" + MetersAtActivePremisesCsvFilename))
                    {
                        File.Copy(ConfigurationManager.AppSettings["MetersAtActivePremisesCsv"],
                            aglcDataFilePath + "\\" + MetersAtActivePremisesCsvFilename);
                    }
                    if (!File.Exists(aglcDataFilePath + "\\" + aglcDataFileName))
                    {
                        throw new Exception("No AGLC data file at " + aglcDataFilePath + "\\" + aglcDataFileName + "!");
                    }
                    options.Source = aglcDataFilePath;
                    options.ForceCreate = false;
                    options.Region = "aglc";
                    Log.Debug("Indexing AGLC data...");
                    RunIndexer(options);
                    Log.Debug("Index copmlete.");
                    Log.Debug("AGLC Process complete.");
                }).Wait();

                // zip process
                Task.Run(async () =>
                {
                    var fastZip = new FastZip();
                    var zipFilePath = ConfigurationManager.AppSettings["ZipOutputPath"];
                    if (zipFilePath == null || zipFilePath.Trim().Length == 0)
                    {
                        zipFilePath = directoryInfo.FullName;
                    }
                    fastZip.CreateZip(zipFilePath + "\\" + ZipFileName, typeaheadFolderPath, true, null);
                }).Wait();
            }
            catch (Exception e)
            {
                Log.Fatal(e);
            }
        }

        private static void DownloadAglcArchive()
        {
            Task.Run(async () =>
            {
                var aglcFiledownloader =
                    new AglcFileDownloader(ConfigurationManager.AppSettings["AglcArchiveDownloadPath"] + "\\");
                Log.Debug("Downloading AGLC SDA...");
                await aglcFiledownloader.Fetch();
                Log.Debug("Download complete.");

                await Task.Delay(2000);
                var aglcSdaFullPath = ConfigurationManager.AppSettings["AglcArchiveDownloadPath"] +
                                      "\\custdata.txt.sda.exe";

                if (!File.Exists(aglcSdaFullPath))
                {
                    throw new Exception("AGLC SDA archive not downloaded!");
                }
                /*
                var startInfo = new ProcessStartInfo
                {
                    CreateNoWindow = true,
                    UseShellExecute = true,
                    FileName = ConfigurationManager.AppSettings["AglcDecrypter"],
                    Arguments = aglcSdaFullPath,
                    WindowStyle = ProcessWindowStyle.Hidden
                };

                Log.Debug("Starting decrypter...");
                using (var decrypter = Process.Start(startInfo))
                {
                    if (decrypter == null) return;
                    decrypter.WaitForExit(10*60*1000); // wait at most 10 minutes
                    if (decrypter.ExitCode == 1)
                    {
                        throw new Exception("Decrypter failed to complete successfully!");
                    }
                    Log.Debug("AGLC SDA decryption complete.");
                }

                var algcDecryptPath = directoryInfo.FullName + "\\export\\home\\custdata\\cmadat\\";
                if (!Directory.Exists(algcDecryptPath))
                {
                    throw new Exception("AGLC archive did not decrypt properly!");
                }
                File.Copy(ConfigurationManager.AppSettings["MetersAtActivePremisesCsv"],
                    algcDecryptPath + MetersAtActivePremisesCsvFilename);

                 var algcFullPath = algcDecryptPath + "custdata.txt";

                if (!File.Exists(algcFullPath))
                {
                    throw new Exception("AGLC archive did not decrypt properly!");
                }

                options.Source = algcDecryptPath;
                 */
            }).Wait();
        }

        private static void RunIndexer(Options options)
        {
            var container = Container.Instance.Unity;

            var unityContainer = new UnityContainer();
            new CoreContainerSetup().SetupUnity(unityContainer);
            new ClientContainerSetup().SetupUnity(unityContainer);
            unityContainer.RegisterType<ISettings, NullSettings>();

            var cacheDirectory = new MMapDirectory(new DirectoryInfo(ConfigurationManager.AppSettings["LuceneCacheDirectory"]));
            var cloudConnectionString = ConfigurationManager.AppSettings["LuceneBlobStorage"];

            Directory.CreateDirectory(options.Destination);
            using (var azureDirectory = FSDirectory.Open(options.Destination))
            using (var indexer = BuildIndexer(options.Region))
            using (var indexBuilder = new IndexBuilder(azureDirectory, options.ForceCreate))
            {
                var streetService = unityContainer.Resolve<SmartyStreetService>();
                indexer.AddAddresses(options, indexBuilder, streetService).Wait();
                
                Log.Debug("Optimizing...");
                indexBuilder.Optimize().Wait();
            }            
        }

        private static IIndexer BuildIndexer(string region)
        {
            switch (region.ToLower())
            {
                case "aglc":
                    return new Indexer(ReportEvery, MaxTasks);
                case "ercot":
                    return new Ercot.Indexer(ReportEvery, MaxTasks);
            }

            throw new NotSupportedException();
        }

    }
}
