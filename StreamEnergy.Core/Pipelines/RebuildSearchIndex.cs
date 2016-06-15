using Sitecore;
using Sitecore.ContentSearch;
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
            if (ContentSearchManager.GetIndex("currents_master_index") != null) 
            {
                ContentSearchManager.GetIndex("currents_master_index").Rebuild();
            }
            if (ContentSearchManager.GetIndex("currents_web_index") != null)
            {
                ContentSearchManager.GetIndex("currents_web_index").Rebuild();
            }
        }

    }
}
