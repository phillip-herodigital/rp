﻿using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class LoadDespositInfoState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public LoadDespositInfoState(IEnrollmentService enrollmentService)
            : base(previousState: typeof(VerifyIdentityState), nextState: typeof(PaymentInfoState))
        {
            this.enrollmentService = enrollmentService;
        }

        public override IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations(UserContext data, InternalContext internalContext)
        {
            if (data.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType != EnrollmentCustomerType.Commercial))
                yield return context => context.Services;
            if (!data.IsRenewal && !data.IsAddLine)
            {
                yield return context => context.ContactInfo;
                yield return context => context.Language;
                yield return context => context.SecondaryContactInfo;
                yield return context => context.SocialSecurityNumber;
                yield return context => context.TaxId;
                yield return context => context.ContactTitle;
                yield return context => context.DoingBusinessAs;
                yield return context => context.PreferredSalesExecutive;
                yield return context => context.OnlineAccount;
                yield return context => context.SelectedIdentityAnswers;
                yield return context => context.MailingAddress;
                if (data.Services.SelectMany(svc => svc.Location.Capabilities).OfType<ServiceStatusCapability>().Any(cap => cap.EnrollmentType == EnrollmentType.MoveIn) && data.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType != EnrollmentCustomerType.Commercial))
                {
                    yield return context => context.PreviousAddress;
                }
            }
        }

        protected override bool NeedRestoreInternalState(UserContext context, InternalContext internalContext)
        {
            return internalContext.Deposit == null ||
                !(from service in (context.Services ?? Enumerable.Empty<LocationServices>())
                 from offer in service.SelectedOffers ?? Enumerable.Empty<SelectedOffer>()
                 join internalService in internalContext.Deposit on new { service.Location, offer.Offer.Id } equals new { internalService.Location, internalService.Offer.Id } into internalServices
                 from internalService in internalServices.DefaultIfEmpty()
                 select internalService != null && internalService.Details != null).All(hasDeposit => hasDeposit);
        }

        public override Task<RestoreInternalStateResult> RestoreInternalState(IStateMachine<UserContext, InternalContext> stateMachine, Type state)
        {
            if (stateMachine.Context.IsRenewal || stateMachine.Context.IsAddLine)
                previousState = typeof(PlanSelectionState);

            return base.RestoreInternalState(stateMachine, state);
        }

        protected override async Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            if (context.IsRenewal || context.IsSinglePage)
            {
                internalContext.Deposit = Enumerable.Empty<Service.LocationOfferDetails<OfferPayment>>();
            }
            else
            {
                if (!context.IsAddLine && !internalContext.CreditCheck.IsCompleted)
                {
                    internalContext.CreditCheck = await enrollmentService.EndCreditCheck(internalContext.CreditCheck);
                    if (!internalContext.CreditCheck.IsCompleted)
                    {
                        return this.GetType();
                    }
                }

                internalContext.Deposit = (await enrollmentService.LoadOfferPayments(internalContext.GlobalCustomerId, internalContext.EnrollmentSaveState.Data, context.Services, internalContext)).ToArray();
            }
            return await base.InternalProcess(context, internalContext);
        }

        public override bool ForceBreak(UserContext context, InternalContext internalContext)
        {
            return !context.IsRenewal && !context.IsAddLine && !context.IsSinglePage && !internalContext.CreditCheck.IsCompleted;
        }
    }
}
