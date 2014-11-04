using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients
{
    class SitecoreProductInfo
    {
        public NameValueCollection Fields { get; set; }

        public KeyValuePair<string, string>[] Footnotes { get; set; }
    }
}
