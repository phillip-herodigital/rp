using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using StackExchange.Redis;

namespace StreamEnergy.RenderingService
{
    class Program
    {
        static void Main(string[] args)
        {
            Uri baseUri = new Uri(ConfigurationManager.AppSettings["WebsiteUrl"]);
            if (args.Length == 0)
            {
                TaskScheduler.UnobservedTaskException += (sender, e) =>
                {
                    e.SetObserved();
                };
                ServiceBase.Run(new ScreenshotListeningService(baseUri));
            }
            else
            {
                new ScreenshotListeningService(baseUri).StartMainLoop().Wait();
            }
        }

    }
}
