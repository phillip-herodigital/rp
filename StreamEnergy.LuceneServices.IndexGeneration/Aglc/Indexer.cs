using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using SmartyStreets = StreamEnergy.Services.Clients.SmartyStreets;

namespace StreamEnergy.LuceneServices.IndexGeneration.Aglc
{
    class Indexer : IIndexer
    {
        private readonly List<Action> onDispose = new List<Action>();
        private int reportEvery;
        private int maxTasks;

        private struct ColumnDefinition
        {
            public int Start;
            public int Length;
            public string GetValue(string line)
            {
                return line.Substring(Start, Length).Trim();
            }
        }

        private struct Configuration
        {
            public const int LineLength = 945;
            public static readonly ColumnDefinition PremiseType = new ColumnDefinition { Start = 0, Length = 1 };
            public const string PremiseTypeCommercial = "B";
            public const string PremiseTypeResidential = "I";
            public static readonly ColumnDefinition AglAccountNumber = new ColumnDefinition { Start = 57, Length = 25 };
            public static readonly ColumnDefinition ZipCode = new ColumnDefinition { Start = 148, Length = 5 };
            public static readonly ColumnDefinition City = new ColumnDefinition { Start = 127, Length = 19 };
        }

        public Indexer(int reportEvery, int maxTasks)
        {
            this.reportEvery = reportEvery;
            this.maxTasks = maxTasks;
        }


        public async Task AddAddresses(Options options, IndexBuilder indexBuilder, SmartyStreets.SmartyStreetService streetService)
        {
            var zipCodes = new HashSet<string>();
            int counter = 0;
            using (var reader = new System.IO.StreamReader(Path.Combine(options.Source, "custdata.txt")))
            {
                while (!reader.EndOfStream)
                {
                    var entry = await reader.ReadLineAsync();
                    if (entry.Length == Configuration.LineLength)
                    {
                        var customerType = GetCustomerType(entry);
                        if (!customerType.HasValue)
                            continue;

                        var aglAccountNumber = Configuration.AglAccountNumber.GetValue(entry);
                        var city = Configuration.City.GetValue(entry);
                        var zipCode = Configuration.ZipCode.GetValue(entry);

                        if (!zipCodes.Contains(zipCode))
                        {
                            await WriteZipCodeLocation(indexBuilder, customerType.Value, zipCode);
                            zipCodes.Add(zipCode);
                        }

                        var resultLocation = new Location
                        {
                            Address = new Address 
                            {
                                // TODO
                                City = city,
                                StateAbbreviation = "GA", 
                                PostalCode5 = zipCode 
                            },
                            Capabilities = GetServiceCapabilities(aglAccountNumber, zipCode)
                        };

                        await indexBuilder.WriteLocation(resultLocation, customerType.Value, "AGLC", true);
                        counter++;
                        if (counter % reportEvery == 0)
                            Console.WriteLine(counter.ToString().PadLeft(11));
                    }
                }
            }
        }

        private Task<bool> WriteZipCodeLocation(IndexBuilder indexBuilder, EnrollmentCustomerType customerType, string zipCode)
        {
            return indexBuilder.WriteLocation(new Location
            {
                Address = new Address
                {
                    StateAbbreviation = "GA",
                    PostalCode5 = zipCode
                },
                Capabilities = GetServiceCapabilities(null, zipCode)
            }, customerType, "AGLC", true);
        }

        private IEnumerable<DomainModels.IServiceCapability> GetServiceCapabilities(string aglAccountNumber, string zipCode)
        {
            return new IServiceCapability[]
                {
                    new GeorgiaGasServiceCapability
                    {
                        AglAccountNumber = aglAccountNumber,
                        Zipcode = zipCode
                    }
                };
        }

        private EnrollmentCustomerType? GetCustomerType(string line)
        {
            switch (Configuration.PremiseType.GetValue(line))
            {
                case Configuration.PremiseTypeCommercial:
                    return DomainModels.Enrollments.EnrollmentCustomerType.Commercial;
                case Configuration.PremiseTypeResidential:
                    return DomainModels.Enrollments.EnrollmentCustomerType.Residential;
            }
            return null;
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
