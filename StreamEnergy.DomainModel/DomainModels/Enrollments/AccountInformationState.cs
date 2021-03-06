﻿using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class AccountInformationState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public AccountInformationState(IEnrollmentService enrollmentService)
            : base(previousState: typeof(PlanSelectionState), nextState: typeof(SaveEnrollmentState))
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
                yield return context => context.MailingAddress;
                if (data.Services.SelectMany(svc => svc.Location.Capabilities).OfType<ServiceStatusCapability>().Any(cap => cap.EnrollmentType == EnrollmentType.MoveIn) && data.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType != EnrollmentCustomerType.Commercial))
                {
                    yield return context => context.PreviousAddress;
                }
            }
        }

        public override IEnumerable<ValidationResult> AdditionalValidations(UserContext context, InternalContext internalContext)
        {
            if (!context.IsRenewal && !context.IsAddLine && context.SocialSecurityNumber == null && context.TaxId == null)
            {
                yield return new ValidationResult("Tax Id or SSN Required", new[] { "SocialSecurityNumber", "TaxId" });
            }
        }

        public override void Sanitize(UserContext context, InternalContext internalContext)
        {
            var changedAddresses = context.Services.Select(s => s.Location).Where(loc => !internalContext.AllOffers.ContainsKey(loc)).ToArray();

            if (context.Services != null && context.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType != EnrollmentCustomerType.Commercial))
            {
                foreach (var service in context.Services)
                {
                    var offers = from offerSet in internalContext.AllOffers
                                 where offerSet.Key == service.Location
                                 from offer in offerSet.Value.Offers
                                 select offer.Id;

                    if (service.SelectedOffers != null)
                    {
                        service.SelectedOffers = (from selectedOffer in service.SelectedOffers
                                                  where offers.Contains(selectedOffer.Offer.Id)
                                                  select selectedOffer).ToArray();
                    }
                }
            }
        }
    }
}
