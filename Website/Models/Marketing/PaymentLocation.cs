using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels;

namespace StreamEnergy.MyStream.Models.Marketing
{
    public class PaymentLocation
    {
        public double Lat { get; set; }
        public double Lon { get; set; }
        public string Hours { get; set; }
        public string Name { get; set; }
        public string Vender { get; set; }
        public string Agent { get; set; }
        public string City { get; set; }
        public string StateAbbreviation { get; set; }
        public string PostalCode5 { get; set; }
        public string AddressLine1 { get; set; }
        public string PhoneNumber { get; set; }
        public List<string> PaymentMethods { get; set; }
        public double Distance { get; set; }
    }
}