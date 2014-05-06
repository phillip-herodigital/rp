using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Extensions
{
    public static class EnumerableExtensions
    {
        public static IEnumerable<T> Flatten<T>(this IEnumerable<T> initialList, Func<T, IEnumerable<T>> subList, bool leafNodesOnly = false)
        {
            if (initialList != null)
            {
                foreach (var entry in initialList)
                {
                    bool hasChild = false;
                    foreach (var entry2 in Flatten(subList(entry), subList, leafNodesOnly))
                    {
                        hasChild = true;
                        yield return entry2;
                    }
                    if (!hasChild || !leafNodesOnly)
                        yield return entry;
                }
            }
        }
    }
}
