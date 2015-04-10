using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;
using System.Web.Http.Filters;
using ResponsivePath.Logging;

namespace StreamEnergy.Mvc
{
    class WebApiExceptionLogging : IExceptionLogger
    {
        public Task LogAsync(ExceptionLoggerContext context, System.Threading.CancellationToken cancellationToken)
        {
            var logger = (ILogger)GlobalConfiguration.Configuration.DependencyResolver.GetService(typeof(ILogger));

            if (cancellationToken.IsCancellationRequested)
            {
                return Task.FromResult<object>(null);
            }
            return logger.Record(new LogEntry
            {
                Severity = ResponsivePath.Logging.Severity.FatalError,
                Message = "Unhandled WebAPI exception",
                Exception = context.Exception
            });
        }
    }
}
