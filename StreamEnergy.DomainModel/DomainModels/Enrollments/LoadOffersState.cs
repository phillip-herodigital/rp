﻿using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class LoadOffersState : IState<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public LoadOffersState(IEnrollmentService enrollmentService)
        {
            this.enrollmentService = enrollmentService;
        }

        public IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations()
        {
            yield return context => context.ServiceAddress.PostalCode5;
            yield return context => context.ServiceCapabilities;
        }

        public IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> AdditionalValidations(UserContext data, InternalContext internalContext)
        {
            yield break;
        }

        public bool IsFinal
        {
            get { return false; }
        }

        public Type Process(UserContext data, InternalContext internalContext)
        {
            LoadInternalState(data, internalContext);

            return typeof(PlanSelectionState);
        }

        public bool RestoreInternalState(IStateMachine<UserContext, InternalContext> stateMachine, ref InternalContext internalContext, ref Type state)
        {
            if (!stateMachine.RestoreStateFrom(typeof(ServiceInformationState), ref internalContext, ref state))
            {
                return false;
            }

            LoadInternalState(stateMachine.Context, internalContext);
            return true;
        }

        private void LoadInternalState(UserContext data, InternalContext internalContext)
        {
            internalContext.AllOffers = enrollmentService.LoadOffers(data.ServiceAddress, data.ServiceCapabilities, data.IsNewService);
            internalContext.ConnectPolicy = enrollmentService.LoadConnectDates(data.ServiceAddress, data.ServiceCapabilities, data.IsNewService);
        }
    }
}