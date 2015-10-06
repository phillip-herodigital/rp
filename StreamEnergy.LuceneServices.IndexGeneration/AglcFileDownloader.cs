using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.FtpClient;
using System.Net.FtpClient.Async;
using System.Text;
using System.Threading.Tasks;
using Lucene.Net.Index;
using Lucene.Net.Util;
using NSoup;

namespace StreamEnergy.LuceneServices.IndexGeneration
{
    class AglcFileDownloader : FileDownloader
    {
        private const string AlgcHost = "ftp.aglcebb.com";
        private const string AglcPath = "/customerdata";
        private const string AglcFilename = "custdata.txt.sda.exe";
        private string _username = "p8003424";
        private string _password = "str33mNG";

        public AglcFileDownloader(string downloadPath) : base(downloadPath)
        {
            
        }

        public override async Task Fetch()
        {
            using(var fClient = new FtpClient())
            using (var fStream = new FileStream(DownloadPath + AglcFilename, FileMode.Create, FileAccess.Write, FileShare.None, BufferSize, true))
            {
                fClient.Credentials = new NetworkCredential(_username, _password);
                fClient.Host = AlgcHost;
                await fClient.ConnectAsync();
                fClient.SetWorkingDirectory(AglcPath);
                var item = await fClient.OpenReadAsync(AglcFilename);
                await item.CopyToAsync(fStream);
            }
        }
    }
}
