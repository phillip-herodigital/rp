using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StackExchange.Redis;

namespace StreamEnergy.RenderingService
{
    class ScreenshotListeningService : System.ServiceProcess.ServiceBase
    {
        bool isRunning = true;
        Task mainLoop;
        RedisQueueListener listener;
        Rasterizer rasterizer;
        string dir;

        public ScreenshotListeningService(Uri baseUri)
        {
            var connString = ConfigurationManager.ConnectionStrings["redisCache"];
            var multiplexer = ConnectionMultiplexer.Connect(connString.ConnectionString);
            var redisDb = multiplexer.GetDatabase();

            dir = Path.GetDirectoryName(typeof(Program).Assembly.Location);
            rasterizer = new Rasterizer(dir, baseUri);
            listener = new RedisQueueListener(redisDb, "EnrollmentScreenshots");
        }

        protected override void OnStart(string[] args)
        {
            base.OnStart(args);

            StartMainLoop();
        }

        protected override void OnStop()
        {
            isRunning = false;
            mainLoop.Wait();
            base.OnStop();
        }

        internal Task StartMainLoop()
        {
            isRunning = true;
            return mainLoop = MainLoop();
        }

        private async Task MainLoop()
        {
            await Task.Yield();
            while (isRunning)
            {
                string value;
                do
                {
                    await Task.Delay(100);
                    value = await listener.Poll();
                } while (isRunning && value == null);

                if (isRunning)
                {
                    byte[] pdf = rasterizer.RasterizeEnrollmentConfirmation(value);

                    // TODO - send to Azure storage
                    Console.WriteLine("Screenshot");
                    File.WriteAllBytes(Path.Combine(dir, "test.pdf"), pdf);
                }
            }
        }
    }
}
