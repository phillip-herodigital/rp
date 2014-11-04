using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.MyStream.Tests.Services.Clients
{
    class Timer : IDisposable
    {
        private readonly Stopwatch sw;

        public Timer()
        {
            sw = new Stopwatch();
            sw.Start();
        }

        void IDisposable.Dispose()
        {
            sw.Stop();
            Trace.WriteLine(sw.ElapsedMilliseconds);
        }
    }
}
