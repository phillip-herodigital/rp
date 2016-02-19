using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Associate
{
    public interface IAssociateLookup
    {
        AssociateInformation LookupAssociate(string associateId);
        AssociateInformation LookupAssociateByGroupId(string groupId);
    }
}
