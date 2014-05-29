using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.LuceneServices.IndexGeneration.Ercot
{
    public class DirectoryLoader : IDisposable
    {
        private readonly List<Action> onDispose = new List<Action>();

        public IEnumerable<FileMetadata> Load(string directory, DateTime startDate = default(DateTime), bool allowFull = true)
        {
            var files = Directory.EnumerateFiles(directory, "*.zip").OrderBy(f => f);
            HashSet<string> hadFullLog = new HashSet<string>();
            HashSet<string> esiIds = new HashSet<string>();

            foreach (var file in files)
            {
                var fileMetadata = ParseFileName(file);
                if (fileMetadata.Date < startDate)
                {
                    // Don't load anything prior to our start date
                    continue;
                }
                if (hadFullLog.Contains(fileMetadata.Tdu))
                {
                    // Don't bother if we've already seen a full log of that TDU.
                    continue;
                }
                if (fileMetadata.IsFull)
                {
                    if (allowFull)
                        hadFullLog.Add(fileMetadata.Tdu);
                    else
                        continue;
                }

                yield return fileMetadata;
            }
            yield break;
        }

        private FileMetadata ParseFileName(string file)
        {
            var parts = Path.GetFileName(file).Split('.');
            var result = new FileMetadata();
            result.Date = DateTime.ParseExact(parts[3], "yyyyMMdd", CultureInfo.InvariantCulture);
            var nameType = parts[5].Split('_');
            result.Tdu = string.Join(" ", nameType.Take(nameType.Length - 1)).Trim();
            result.IsFull = nameType.Last() == "FUL";
            result.FullPath = file;
            return result;
        }

        void IDisposable.Dispose()
        {
            foreach (var action in onDispose)
            {
                action();
            }
            onDispose.Clear();
        }
    }
}
