﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using StackExchange.Redis;

namespace StreamEnergy.RenderingService
{
    class ScreenshotListeningService : System.ServiceProcess.ServiceBase
    {
        public const string Name = "StreamEnergy Screenshot Service";
        private readonly RedisQueueListener listener;
        private readonly Rasterizer rasterizer;
        private readonly Microsoft.WindowsAzure.Storage.File.CloudFileDirectory azureDir;

        private CancellationTokenSource cancellationToken;
        private Task mainLoop;
        private RenderingListener[] renderingListeners;

        public ScreenshotListeningService(Uri baseUri)
        {
            this.ServiceName = Name;
            this.EventLog.Log = "Application";

            // These Flags set whether or not to handle that specific
            //  type of event. Set to true if you need it, false otherwise.
            this.CanHandlePowerEvent = true;
            this.CanHandleSessionChangeEvent = false;
            this.CanPauseAndContinue = false;
            this.CanShutdown = false;
            this.CanStop = true;

            var connString = ConfigurationManager.ConnectionStrings["redisCache"];
            var multiplexer = ConnectionMultiplexer.Connect(connString.ConnectionString);
            var redisDb = multiplexer.GetDatabase();
            var cloudStorageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["azureStorage"].ConnectionString);

            var dir = Path.GetDirectoryName(typeof(ScreenshotListeningService).Assembly.Location);
            rasterizer = new Rasterizer(dir, baseUri);
            renderingListeners = new[]
                {
                    new RenderingListener(rasterizer, "EnrollmentScreenshots", redisDb, cloudStorageAccount)
                };
        }

        protected override void OnStart(string[] args)
        {
            base.OnStart(args);

            StartMainLoop();
        }

        protected override void OnStop()
        {
            cancellationToken.Cancel();
            mainLoop.Wait();
            base.OnStop();
        }

        internal Task StartMainLoop()
        {
            cancellationToken = new CancellationTokenSource();
            return mainLoop = MainLoop();
        }

        private async Task MainLoop()
        {
            await Task.Yield();
            while (!cancellationToken.IsCancellationRequested)
            {
                await Task.Delay(100);
                foreach (var entry in renderingListeners)
                {
                    await entry.SingleIteration(cancellationToken.Token);
                }
            }
        }
    }
}