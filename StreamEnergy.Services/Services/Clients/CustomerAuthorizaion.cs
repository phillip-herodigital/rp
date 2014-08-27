using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients
{
    class CustomerAuthorizaion
    {
        public int AuthorizationId { get; set; }
        public string Text { get; set; }
        public AuthorizationType AuthorizationType { get; set; }
        public bool Accepted { get; set; }
        public DateTime AcceptedDate { get; set; }
        public int AcceptedUserId { get; set; }
        public int MarketAuthorizationId { get; set; }
        public int MarketAuthorizationMessageId { get; set; }
    }
}
