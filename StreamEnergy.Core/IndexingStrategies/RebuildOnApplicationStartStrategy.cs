using Sitecore.ContentSearch;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.IndexingStrategies
{
    class RebuildOnApplicationStartStrategy: Sitecore.ContentSearch.Maintenance.Strategies.IIndexUpdateStrategy
    {
        public virtual void Initialize(Sitecore.ContentSearch.ISearchIndex searchIndex)
        {
            Sitecore.ContentSearch.Maintenance.IndexCustodian.FullRebuild(searchIndex);
        }
    }
}
