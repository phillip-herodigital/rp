using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels
{
    /// <summary>
    /// Information used to contact the customer
    /// </summary>
    public class CustomerContact : ISanitizable
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string PrimaryPhone { get; set; }
        public string HomePhone { get; set; }
        public string CellPhone { get; set; }
        public string WorkPhone { get; set; }

        public string EmailAddress { get; set; }

        void ISanitizable.Sanitize()
        {
            throw new NotImplementedException();
        }
    }
}
