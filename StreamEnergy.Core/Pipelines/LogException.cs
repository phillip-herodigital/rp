using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Sitecore.Mvc.Pipelines.MvcEvents.Exception;
using StreamEnergy.Logging;

namespace StreamEnergy.Pipelines
{
    class LogException : ExceptionProcessor
    {
        public override void Process(ExceptionArgs args)
        {
            var logger = DependencyResolver.Current.GetService<ILogger>();

            if (!args.ExceptionContext.ExceptionHandled)
            {
                logger.Record(new LogEntry
                {
                    Severity = Logging.Severity.FatalError,
                    Message = "Unhandled exception",
                    Exception = args.ExceptionContext.Exception
                });
            }
        }
    }
}
