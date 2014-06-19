using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public enum ExpectedState
    {
        ServiceInformation,
        PlanSelection,
        AccountInformation,
        VerifyIdentity,
        CompleteOrder,
        OrderConfirmed
    }
}