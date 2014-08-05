using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels
{
    [Serializable]
    public class StreamAsync<T>
    {
        public Uri ResponseLocation { get; set; }

        public bool IsCompleted { get; set; }

        public T Data { get; set; }
    }
}
