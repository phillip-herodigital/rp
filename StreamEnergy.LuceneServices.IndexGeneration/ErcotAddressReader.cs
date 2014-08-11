using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using StreamEnergy.LuceneServices.Web.Models;

namespace StreamEnergy.LuceneServices.IndexGeneration
{
    class ErcotAddressReader
    {
        private readonly static Regex addressLine;
        private readonly static Regex cleanExtraSpaces = new Regex(@"\s\s+", RegexOptions.Compiled);
        private readonly static Regex postalCode = new Regex(@"(?<Zip5>[0-9]{5})(-?(?<Plus4>[0-9]{4}))?", RegexOptions.Compiled);

        private Ercot.FileReader fileReader;
        private System.IO.FileStream fileStream;
        private string tdu;

        static ErcotAddressReader()
        {
            var regex = @"^(\s*0*(?<StreetNumber>[1-9][0-9]*)\s+)?" +
                @"(?<StreetName>.+?)(\s+" +
                @"(?<StreetSuffix>(" + string.Join("|", AddressConstants.StreetSuffixes) + @"|[0-9]+)(\s+[NESW])?)(\s+" +
                @"(?<Unit>[a-zA-Z]+(\s+\w+)?)?)?)?$";
            addressLine = new Regex(regex, RegexOptions.Compiled);
        }

        public ErcotAddressReader(Ercot.FileReader fileReader, System.IO.FileStream fileStream, string tdu)
        {
            this.fileReader = fileReader;
            this.fileStream = fileStream;
            this.tdu = tdu;
        }

        public IEnumerable<Location> Addresses
        {
            get
            {
                return ToLocation(fileReader.ReadZipFile(fileStream, tdu));
            }
        }


        private static IEnumerable<DomainModels.Enrollments.Location> ToLocation(IEnumerable<Tuple<Ercot.Record, DomainModels.IServiceCapability[]>> records)
        {
            var streetService = new SmartyStreets.SmartyStreetService();
            foreach (var lineGroup in TakeBy(records, 100))
            {

                var cleansedAddresses = streetService.CleanseAddress((from record in lineGroup
                                                                      select new SmartyStreets.UncleansedAddress
                                                                      {
                                                                          Street = record.Item1.Address + " " + record.Item1.AddressOverflow,
                                                                          Zipcode = record.Item1.Zipcode,
                                                                          City = record.Item1.City,
                                                                          State = "TX",
                                                                      }).ToArray()).Result;

                foreach (var result in lineGroup.Zip(cleansedAddresses, (record, address) => new DomainModels.Enrollments.Location
                {
                    Address = address,
                    Capabilities = record.Item2
                }).Where(loc => loc.Address != null))
                {
                    yield return result;
                }
            }
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

        private static Address FromRecord(Ercot.Record record)
        {
            var match = addressLine.Match(record.Address + " " + record.AddressOverflow);
            Func<string, string> safeGroup = (groupName) => match.Groups[groupName] != null ? match.Groups[groupName].Value : "";

            var result = new Address
            {
                Line1 = cleanExtraSpaces.Replace(safeGroup("StreetNumber") + " " + safeGroup("StreetName") + " " + safeGroup("StreetSuffix"), " ").Trim(),
                UnitNumber = cleanExtraSpaces.Replace(safeGroup("Unit"), " ").Trim()
            };

            match = postalCode.Match(record.Zipcode);
            result.PostalCode5 = safeGroup("Zip5");
            result.PostalCodePlus4 = safeGroup("Plus4");
            result.StateAbbreviation = "TX";
            result.City = record.City;

            ((ISanitizable)result).Sanitize();

            return result;
        }
    }
}
