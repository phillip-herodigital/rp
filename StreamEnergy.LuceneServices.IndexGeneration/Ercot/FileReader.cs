using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using CsvHelper;
using ICSharpCode.SharpZipLib.Zip;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using StreamEnergy.LuceneServices.Web.Models;

namespace StreamEnergy.LuceneServices.IndexGeneration.Ercot
{
    public class FileReader : IDisposable
    {
        private readonly static Regex addressLine;
        private readonly static Regex cleanExtraSpaces = new Regex(@"\s\s+", RegexOptions.Compiled);
        private readonly static Regex postalCode = new Regex(@"(?<Zip5>[0-9]{5})(-?(?<Plus4>[0-9]{4}))?", RegexOptions.Compiled);
        // From https://www.usps.com/send/official-abbreviations.htm
        private readonly List<Action> onDispose = new List<Action>();

        static FileReader()
        {
            var regex = @"^(\s*0*(?<StreetNumber>[1-9][0-9]*)\s+)?" +
                @"(?<StreetName>.+?)(\s+" +
                @"(?<StreetSuffix>(" + string.Join("|", AddressConstants.StreetSuffixes) + @"|[0-9]+)(\s+[NESW])?)(\s+" +
                @"(?<Unit>[a-zA-Z]+(\s+\w+)?)?)?)?$";
            addressLine = new Regex(regex, RegexOptions.Compiled);
        }

        public IEnumerable<Tuple<Record, IServiceCapability[]>> ReadZipFile(Stream inputStream, string tdu)
        {
            var zipFile = new ZipFile(inputStream);
            onDispose.Add(((IDisposable)zipFile).Dispose);
            // ERCOT files should have only one CSV each.
            var entry = zipFile.Cast<ZipEntry>().First(f => f.IsFile);
            var zipStream = zipFile.GetInputStream(entry);
            onDispose.Add(((IDisposable)zipStream).Dispose);

            return ReadCsvFile(zipStream, tdu);
        }

        private IEnumerable<Tuple<Record, IServiceCapability[]>> ReadCsvFile(Stream inputStream, string tdu)
        {
            var textReader = new StreamReader(inputStream);
            var csv = new CsvReader(textReader);
            onDispose.Add(((IDisposable)textReader).Dispose);
            onDispose.Add(((IDisposable)csv).Dispose);

            csv.Configuration.HasHeaderRecord = false;
            return ReadCsvFile(csv, tdu);
        }

        private IEnumerable<Tuple<Record, IServiceCapability[]>> ReadCsvFile(CsvReader csv, string tdu)
        {
            while (csv.Read())
            {
                var record = new Record();
                record.EsiId = csv.GetField<string>(0);
                record.Address = csv.GetField<string>(1);
                record.AddressOverflow = csv.GetField<string>(2);
                record.City = csv.GetField<string>(3);
                record.State = csv.GetField<string>(4);
                record.Zipcode = csv.GetField<string>(5);
                record.Duns = csv.GetField<string>(6);
                record.MeterReadCycle = csv.GetField<string>(7);
                record.Status = csv.GetField<string>(8);
                record.PremiseType = csv.GetField<string>(9);
                record.PowerRegion = csv.GetField<string>(10);
                record.Stationcode = csv.GetField<string>(11);
                record.Stationname = csv.GetField<string>(12);
                record.Metered = csv.GetField<string>(13);
                record.OpenServiceOrders = csv.GetField<string>(14);
                record.PolrCustomerClass = csv.GetField<string>(15);
                record.SettlementAmsIndicator = csv.GetField<string>(16);
                record.TdspAmsIndicator = csv.GetField<string>(17);
                record.SwitchHoldIndictor = csv.GetField<string>(18);
                yield return Tuple.Create(record, GetServiceCapabilities(record, tdu));
            }
        }

        private IServiceCapability[] GetServiceCapabilities(Record record, string tdu)
        {
            return new IServiceCapability[]
                {
                    new TexasServiceCapability
                    {
                        EsiId = record.EsiId,
                        Tdu = tdu,
                        MeterType = ToAmsIndicator(record.TdspAmsIndicator, record.Metered),
                        Address = record.Address,
                        AddressOverflow= record.AddressOverflow,
                        City = record.City,
                        State = record.State,
                        Zipcode = record.Zipcode,
                    }
                };
        }

        private TexasMeterType ToAmsIndicator(string tdspAmsIndicator, string metered)
        {
            if (metered == "N")
                return TexasMeterType.NotMetered;
            switch (tdspAmsIndicator)
            {
                case "AMSM":
                    return TexasMeterType.Amsm;
                case "AMSR":
                    return TexasMeterType.Amsr;
                default:
                    return TexasMeterType.Other;
            }
        }

        public string WriteCsv(IEnumerable<Address> enumerable)
        {
            using (var textWriter = new StringWriter())
            using (var csv = new CsvWriter(textWriter))
            {
                csv.WriteRecords((System.Collections.IEnumerable)enumerable);
                return textWriter.ToString();
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
