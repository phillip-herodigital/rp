﻿using StreamEnergy.Extensions;
using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class ServiceInformationState : StateBase<UserContext, InternalContext>
    {
        public ServiceInformationState()
            : base(previousState: null, nextState: typeof(LoadOffersState))
        {
        }

        public override IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations(UserContext data, InternalContext internalContext)
        {
            yield return context => context.Services.PartialValidate(e => e.Location.Address.PostalCode5,
                                                                     e => e.Location.Capabilities);
        }
    }
}
