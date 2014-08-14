using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.RenderingService
{
    class Rasterizer
    {
        private readonly string dir;
        private readonly PhantomJs phantomJs;
        private readonly Uri baseUrl;

        public Rasterizer(string dir, Uri baseUrl)
        {
            this.dir = dir;
            this.baseUrl = baseUrl;
            this.phantomJs = new PhantomJs(Path.Combine(dir, "PhantomJS.exe"));
        }

        internal byte[] RasterizeEnrollmentConfirmation(string json)
        {
            var pdfPath = Path.Combine(dir, "test.pdf");
            phantomJs.Execute(Path.Combine(dir, "rasterize.js"), new[] { new Uri(baseUrl, "/enrollment/confirmation?phantomjs=1").ToString(), pdfPath }, json);

            byte[] buffer = File.ReadAllBytes(pdfPath);
            File.Delete(pdfPath);

            return buffer;
        }
    }
}
