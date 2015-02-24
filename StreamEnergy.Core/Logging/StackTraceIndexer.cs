using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace StreamEnergy.Logging
{
    class StackTraceIndexer : IDataAccumulator, ILogIndexer
    {
        void IDataAccumulator.AccumulateData(LogEntry logEntry)
        {
            if (logEntry.Exception == null)
            {
                logEntry.Data["StackTrace"] = TrimAsync(Environment.StackTrace);
            }
            else
            {
                StringBuilder stackTrace = new StringBuilder();
                Stack<Exception> stack = new Stack<Exception>();
                var ex = logEntry.Exception;
                while (ex != null)
                {
                    stack.Push(ex);
                    ex = ex.InnerException;
                }
                do
                {
                    ex = stack.Pop();
                    stackTrace.AppendLine(ex.StackTrace);
                } while (stack.Count > 0);
                logEntry.Data["StackTrace"] = TrimAsyncException(stackTrace.ToString());
            }
        }

        private string TrimAsync(string stackTrace)
        {
            var lines = stackTrace.Split('\n').Skip(4);
            if (lines.Any(line => line.Contains("System.Threading.ExecutionContext.RunInternal")))
            {
                return string.Join("\n", lines.TakeWhile(line => !line.Contains("System.Threading.ExecutionContext.RunInternal"))) +
                    "\n--- Async ---";
            }
            return stackTrace;
        }

        private string TrimAsyncException(string stackTrace)
        {
            var lines = stackTrace.Split('\n');
            if (lines.Any(line => line.Contains("System.Runtime.CompilerServices.TaskAwaiter.ThrowForNonSuccess")))
            {
                return string.Join("\n", lines.TakeWhile(line => !line.Contains("System.Runtime.CompilerServices.TaskAwaiter.ThrowForNonSuccess"))) +
                    "\n--- Async ---";
            }
            return stackTrace;
        }

        Task ILogIndexer.IndexData(LogEntry logEntry)
        {
            var stackTrace = (string)logEntry.Data["StackTrace"];
            var rootPath = Regex.Match(stackTrace, @" in (.*)\\StreamEnergy").Groups[1].Value;
            var limited = stackTrace.Replace(rootPath, "");
            var hash = Convert.ToBase64String(System.Security.Cryptography.MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(limited)));
            logEntry.Indexes["StackTraceHash"] = hash;

            return Task.FromResult<object>(null);
        }
    }
}
