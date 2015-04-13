using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StreamEnergy.DomainModels.Accounts;

namespace Cis2AureaAccountImport
{
    class FakeSubAccount : ISubAccount
    {
        string ISubAccount.SubAccountType
        {
            get { throw new NotImplementedException(); }
        }

        string ISubAccount.Key
        {
            get { throw new NotImplementedException(); }
        }

        string ISubAccount.Id
        {
            get { throw new NotImplementedException(); }
        }

        StreamEnergy.DomainModels.Enrollments.EnrollmentCustomerType ISubAccount.CustomerType
        {
            get { throw new NotImplementedException(); }
        }

        string ISubAccount.ProductType
        {
            get { throw new NotImplementedException(); }
        }

        StreamEnergy.DomainModels.Address ISubAccount.ServiceAddress
        {
            get { throw new NotImplementedException(); }
        }

        void StreamEnergy.ISanitizable.Sanitize()
        {
            throw new NotImplementedException();
        }

        IList<ISubAccountCapability> ISubAccount.Capabilities
        {
            get { throw new NotImplementedException(); }
        }
    }
}
