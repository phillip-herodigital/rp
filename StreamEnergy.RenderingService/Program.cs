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
            var websiteUrl = ConfigurationManager.AppSettings["WebsiteUrl"];
            try
            {
                var cloudSetting = Microsoft.WindowsAzure.CloudConfigurationManager.GetSetting("StreamEnergy.Services.WebsiteUrl");

                if (cloudSetting != null)
                {
                    websiteUrl = cloudSetting;
                }
            }
            catch {} //just eat it

            Uri baseUri = new Uri(websiteUrl);
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
