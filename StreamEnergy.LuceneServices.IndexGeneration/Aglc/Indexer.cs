using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using StreamEnergy.DomainModels.Enrollments.GeorgiaGas;
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
            public static readonly ColumnDefinition AglAccountNumber = new ColumnDefinition { Start = 57, Length = 10 };
            public static readonly ColumnDefinition ServiceAddressStreetNumber = new ColumnDefinition { Start = 67, Length = 15 };
            public static readonly ColumnDefinition ServiceAddressStreetCardinalDirection = new ColumnDefinition { Start = 82, Length = 1 };
            public static readonly ColumnDefinition ServiceAddressStreetName = new ColumnDefinition { Start = 83, Length = 23 };
            public static readonly ColumnDefinition ServiceAddressThoroughfare = new ColumnDefinition { Start = 106, Length = 4 };
            public static readonly ColumnDefinition ServiceAddressStreetDirection = new ColumnDefinition { Start = 110, Length = 2 };
            public static readonly ColumnDefinition ServiceAddressStructure = new ColumnDefinition { Start = 112, Length = 15 };
            public static readonly ColumnDefinition City = new ColumnDefinition { Start = 127, Length = 19 };
            public static readonly ColumnDefinition ZipCode = new ColumnDefinition { Start = 148, Length = 5 };
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
            foreach (var resultLocation in Cleanse(ReadLocations(Path.Combine(options.Source, "custdata.txt")), streetService))
            {

                if (!zipCodes.Contains(resultLocation.Address.PostalCode5))
                {
                    await WriteZipCodeLocation(indexBuilder, resultLocation.Address.PostalCode5);
                    zipCodes.Add(resultLocation.Address.PostalCode5);
                }

                await indexBuilder.WriteLocation(resultLocation, resultLocation.Capabilities.OfType<CustomerTypeCapability>().Single().CustomerType, "AGLC", true);
                counter++;
                if (counter % reportEvery == 0)
                    Console.WriteLine(counter.ToString().PadLeft(11));
            }
        }

        private IEnumerable<Location> Cleanse(IEnumerable<Location> locations, SmartyStreets.SmartyStreetService streetService)
        {
            foreach (var locGroup in TakeBy(locations, 100))
            {
                var cleansedAddresses = streetService.CleanseAddress((from record in locGroup
                                                                      select new SmartyStreets.UncleansedAddress
                                                                      {
                                                                          Street = record.Address.Line1 + " " + record.Address.Line2,
                                                                          Zipcode = record.Address.PostalCode5,
                                                                          City = record.Address.City,
                                                                          State = record.Address.StateAbbreviation,
                                                                      }).ToArray()).Result;

                foreach (var result in locGroup.Zip(cleansedAddresses, (record, address) => new DomainModels.Enrollments.Location
                {
                    Address = address ?? record.Address,
                    Capabilities = record.Capabilities
                }).Where(entry => entry.Address != null))
                {
                    yield return result;
                }
            }
        }

        private IEnumerable<Location> ReadLocations(string customerDataPath)
        {
            using (var reader = new System.IO.StreamReader(customerDataPath))
            {
                while (!reader.EndOfStream)
                {
                    var entry = reader.ReadLine();
                    if (entry.Length == Configuration.LineLength)
                    {
                        var customerType = GetCustomerType(entry);
                        if (!customerType.HasValue)
                            continue;

                        var aglAccountNumber = Configuration.AglAccountNumber.GetValue(entry);

                        var streetNumber = Configuration.ServiceAddressStreetNumber.GetValue(entry);
                        var streetCardinalDirection = Configuration.ServiceAddressStreetCardinalDirection.GetValue(entry);
                        var streetName = Configuration.ServiceAddressStreetName.GetValue(entry).Replace('-', ' ');
                        var thoroughfare = Configuration.ServiceAddressThoroughfare.GetValue(entry);
                        var streetDirection = Configuration.ServiceAddressStreetDirection.GetValue(entry);
                        var structure = Configuration.ServiceAddressStructure.GetValue(entry);

                        var city = Configuration.City.GetValue(entry);
                        var zipCode = Configuration.ZipCode.GetValue(entry);

                        yield return new Location
                        {
                            Address = new Address
                            {
                                Line1 = streetNumber + " " + streetCardinalDirection + " " + streetName + " " + streetDirection,
                                Line2 = structure,
                                City = city,
                                StateAbbreviation = "GA",
                                PostalCode5 = zipCode
                            },
                            Capabilities = GetServiceCapabilities(aglAccountNumber, zipCode, customerType.Value)
                        };

                    }
                }
            }
        }

        private async Task WriteZipCodeLocation(IndexBuilder indexBuilder, string zipCode)
        {
            await indexBuilder.WriteLocation(new Location
            {
                Address = new Address
                {
                    StateAbbreviation = "GA",
                    PostalCode5 = zipCode
                },
                Capabilities = GetServiceCapabilities(null, zipCode, EnrollmentCustomerType.Commercial)
            }, EnrollmentCustomerType.Commercial, "AGLC", true);

            await indexBuilder.WriteLocation(new Location
            {
                Address = new Address
                {
                    StateAbbreviation = "GA",
                    PostalCode5 = zipCode
                },
                Capabilities = GetServiceCapabilities(null, zipCode, EnrollmentCustomerType.Residential)
            }, EnrollmentCustomerType.Residential, "AGLC", true);
        }

        private IEnumerable<DomainModels.IServiceCapability> GetServiceCapabilities(string aglAccountNumber, string zipCode, EnrollmentCustomerType customerType)
        {
            return new IServiceCapability[]
                {
                    new ServiceCapability
                    {
                        AglAccountNumber = aglAccountNumber,
                        Zipcode = zipCode
                    },
                    new  CustomerTypeCapability
                    {
                        CustomerType = customerType
                    },
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

        private static IEnumerable<IEnumerable<T>> TakeBy<T>(IEnumerable<T> records, int count)
        {
            int prev = 0;
            List<T> intermediate = new List<T>();
            foreach (var indexed in records.Select((record, index) => new { record, index }))
            {
                if (indexed.index / count != prev)
                {
                    prev = indexed.index / count;
                    yield return intermediate.AsReadOnly();
                    intermediate = new List<T>();
                }

                intermediate.Add(indexed.record);
            }
            yield return intermediate.AsReadOnly();
        }
    }
}
