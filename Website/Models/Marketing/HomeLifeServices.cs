using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Marketing
{
    public class HomeLifeServices
    {
        public string PostUrl { get; set; }
        public string ClientID { get; set; }

        public string CampaignName { get; set; }
		public string CustomerNumber { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Address1 { get; set; }
		public string Address2 { get; set; }
		public string City { get; set; }
		public string State { get; set; }
		public string ZipCode { get; set; }
		public string Phone1 { get; set; }
		public string Phone2 { get; set; }
		public string Phone3 { get; set; }
		public string RepId { get; set; }
		public string RepFirstName { get; set; }
		public string RepLastName { get; set; }
        public string RepEmail { get; set; }
    }
}