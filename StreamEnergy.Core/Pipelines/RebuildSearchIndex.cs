using Sitecore;
using Sitecore.Pipelines;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;

namespace StreamEnergy.Pipelines
{
    public class RebuildSearchIndex
    {
        [UsedImplicitly]
        public virtual void Process(PipelineArgs args)
        {
            if (Sitecore.Search.SearchManager.GetIndex("currents_master_index") != null) 
            {
                Sitecore.Search.SearchManager.GetIndex("currents_master_index").Rebuild();
            }
            if (Sitecore.Search.SearchManager.GetIndex("currents_web_index") != null)
            {
                Sitecore.Search.SearchManager.GetIndex("currents_web_index").Rebuild();
            }
        }

    }
}
