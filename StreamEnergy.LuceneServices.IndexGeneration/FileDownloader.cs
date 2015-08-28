using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.LuceneServices.IndexGeneration
{
    internal abstract class FileDownloader
    {
        protected const int BufferSize = 4096;

        protected string DownloadPath;

        protected FileDownloader(string _downloadPath)
        {
            this.DownloadPath = _downloadPath;
            if (!_downloadPath.EndsWith("/"))
            {
                _downloadPath += "/";
            }
        }

        public abstract Task Fetch();

    }
}
