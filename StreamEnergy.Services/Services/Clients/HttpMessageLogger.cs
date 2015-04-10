using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Logging;

namespace StreamEnergy.Services.Clients
{
    class HttpMessageLogger : DelegatingHandler
    {
        private readonly ILogger logger;

        public HttpMessageLogger(ILogger logger, HttpMessageHandler innerHandler)
            : base(innerHandler)
        {
            this.logger = logger;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            var loggableRequest = await HttpConverter.ToObject(request).ConfigureAwait(false);
            var sw = new Stopwatch();
            sw.Start();
            var response = await base.SendAsync(request, cancellationToken);
            sw.Stop();
            await logger.Record(new LogEntry
                {
                    Message = "HttpClient logging",
                    Severity = response.IsSuccessStatusCode ? Severity.Debug : Severity.Warning,
                    Data = {
                        { "HttpClient", new { duration = sw.Elapsed, request = loggableRequest, response = await HttpConverter.ToObject(response) } }
                    }
                });
            return response;
        }
    }
}
