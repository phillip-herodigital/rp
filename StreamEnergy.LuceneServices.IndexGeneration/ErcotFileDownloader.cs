using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Lucene.Net.Util;
using NSoup;

namespace StreamEnergy.LuceneServices.IndexGeneration
{
    class ErcotFileDownloader : FileDownloader
    {
        private static readonly string[] _providers =
        {
            "AEP_CENTRAL",
            "AEP_NORTH",
            "TNMP",
            "ONCOR_ELEC",
            "CENTERPOINT",
            "SHARYLAND_MCALLEN",
            "SHARYLAND_UTILITIES"
        };

        private const string ErcotBaseUrl = "http://mis.ercot.com";
        private const string ErcotAppUrl = ErcotBaseUrl + "/misapp/GetReports.do?reportTypeId=203";
        private const string ErcotTdClass = "td.labelOptional_ind";
        private const string ErcotLabelSuffix = "_FUL.zip";

        public ErcotFileDownloader(string downloadPath) : base(downloadPath)
        {
        }

        public override async Task Fetch()
        {
            var filesToDownload = new Dictionary<string, string>();

            var hClient = new HttpClient();

            var resp = await hClient.GetAsync(ErcotAppUrl);

            if (!resp.IsSuccessStatusCode)
            {
                Console.WriteLine("Cannot reach ercot.");
                return;
            }

            var doc = NSoupClient.Parse(await resp.Content.ReadAsStringAsync());
            var subTable = doc.Select("table table");
            var trs = subTable.Select("tr");
            foreach (var tr in trs)
            {
                var label = tr.Select(ErcotTdClass);
                if (!label.HasText ||
                    !label.Text.EndsWith(ErcotLabelSuffix) ||
                    _providers.All(p => label.Text.IndexOf(p) < 0))
                {
                    continue;
                }
                var a = doc.Select("a[href]");
                filesToDownload.Add(label.Text, ErcotBaseUrl + a.Attr("href"));
            }

            foreach (var kv in filesToDownload)
            {
                //Console.WriteLine("filename: {0}, url: {1}", kv.Key, kv.Value);
                using (var hStream = await hClient.GetStreamAsync(kv.Value))
                using (var fStream = new FileStream(DownloadPath + kv.Key, FileMode.Create, FileAccess.Write, FileShare.None, BufferSize, true))
                {
                    await hStream.CopyToAsync(fStream);
                }
            }
        }
    }
}
