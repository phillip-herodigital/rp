using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.RenderingService
{
    class PhantomJs
    {
        private string phantomJsPath;

        public PhantomJs(string phantomJsPath)
        {
            this.phantomJsPath = phantomJsPath;
        }

        public string Execute(string jsFile, string[] args, string inputStream = null)
        {
            var process = new System.Diagnostics.Process();
            var startInfo = new System.Diagnostics.ProcessStartInfo
            {
                WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden,
                UseShellExecute = false,
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                FileName = phantomJsPath,
                Arguments = EscapeCommandLineArguments(new[] { jsFile }.Concat(args))
            };

            process.StartInfo = startInfo;
            process.Start();
            if (inputStream != null)
            {
                process.StandardInput.WriteLine(inputStream);
            }
            string output = process.StandardOutput.ReadToEnd();
            string error = process.StandardError.ReadToEnd();
            if (error.Length > 0)
                throw new InvalidOperationException(error);
            process.WaitForExit();

            return output;
        }

        private static string EscapeCommandLineArguments(IEnumerable<string> args)
        {
            return string.Join(" ", args.Select(arg => "\"" + arg.Replace("\\", "\\\\").Replace("\"", "\\\"") + "\""));
        }
    }
}
