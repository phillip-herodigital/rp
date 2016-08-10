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
        public IEnumerable<DateHours> Hours { get; set; }
        public string Name { get; set; }
        public double ID { get; set; }
        public string Vender { get; set; }
        public string Agent { get; set; }
        public string City { get; set; }
        public string StateAbbreviation { get; set; }
        public string PostalCode5 { get; set; }
        public string PostalCodePlus4 { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string ContactName { get; set; }
        public string PhoneNumber { get; set; }
        public bool Fee { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public String Status { get; set; }
        public List<string> PaymentMethods { get; set; }
        public double Rank { get; set; }
        public double Distance { get; set; }

        public class DateHours
        {
            public int StartDate { get; set; }
            public int EndDate { get; set; }
            public string Hours { get; set; }
        }
    }
}