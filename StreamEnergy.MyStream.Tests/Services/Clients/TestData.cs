using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.MyStream.Tests.Services.Clients
{
    class TestData
    {
        public const string IstaAccountNumber = "3001433429";
        public const string IstaAccountSsnLast4 = "9250";
        public const string CreditCheckSsn = "666361452";
        public const string IdentityCheckSsn = "666540716";
        public const string CardToken = "9411068799444113";
        public const string BankToken = "9034758863046789";
        public const string BankRoutingNumber = "031202084";

        public static DomainModels.CustomerContact CreditCheckContactInfo()
        {
            return new DomainModels.CustomerContact
            {
                Name = new DomainModels.Name
                {
                    First = "ROBERT",
                    Last = "DELEON"
                },
                Phone = new DomainModels.Phone[] { new DomainModels.TypedPhone { Category = DomainModels.PhoneCategory.Home, Number = "2234567890" } },
                Email = new DomainModels.Email { Address = "test@example.com" },
            };
        }

        internal static DomainModels.Address CreditCheckAddress()
        {
            return new DomainModels.Address { Line1 = "1212 Aberdeen Avenue", City = "McKinney", StateAbbreviation = "TX", PostalCode5 = "75070" };
        }


        internal static DomainModels.Name IdentityCheckName()
        {
            return new DomainModels.Name { First = "ROBERT", Last = "DELEON" };
        }

        internal static DomainModels.Address IdentityCheckMailingAddress()
        {
            return new DomainModels.Address { Line1 = "100 WILSON HILL RD", City = "MASSENA", StateAbbreviation = "NY", PostalCode5 = "13662" };
        }
    }
}
