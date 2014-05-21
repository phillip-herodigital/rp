﻿using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class VerifyIdentityState : IState<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public VerifyIdentityState(IEnrollmentService enrollmentService)
        {
            this.enrollmentService = enrollmentService;
        }

        public IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations()
        {
            yield return context => context.Services;
            yield return context => context.BillingAddress;
            yield return context => context.ContactInfo;
            yield return context => context.Language;
            yield return context => context.SecondaryContactInfo;
            yield return context => context.SocialSecurityNumber;
            yield return context => context.DriversLicense;
            yield return context => context.SelectedIdentityAnswers;
        }

        public IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> AdditionalValidations(UserContext context, InternalContext internalContext)
        {
            yield break;
        }

        bool IState<UserContext, InternalContext>.IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, UserContext context, InternalContext internalContext)
        {
            return false;
        }

        public bool IsFinal
        {
            get { return false; }
        }

        public Type Process(UserContext context, InternalContext internalContext)
        {
            internalContext.IdentityCheckResult = enrollmentService.IdentityCheck(context.ContactInfo.Name, context.SocialSecurityNumber, context.DriversLicense, context.BillingAddress, new AdditionalIdentityInformation
                {
                    PreviousIdentityCheckId = internalContext.IdentityCheckResult.IdentityCheckId,
                    SelectedAnswers = context.SelectedIdentityAnswers
                });

            return typeof(LoadDespositInfoState);
        }

        public bool RestoreInternalState(IStateMachine<UserContext, InternalContext> stateMachine, ref InternalContext internalContext, ref Type state)
        {
            if (!stateMachine.RestoreStateFrom(typeof(LoadIdentityQuestionsState), ref internalContext, ref state))
            {
                return false;
            }

            return true;
        }
    }
}
