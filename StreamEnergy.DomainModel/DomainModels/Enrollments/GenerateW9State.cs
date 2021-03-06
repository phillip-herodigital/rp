﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Documents;
using StreamEnergy.DomainModels.MobileEnrollment;
using ResponsivePath.Logging;
using StreamEnergy.Processes;

namespace StreamEnergy.DomainModels.Enrollments
{
    class GenerateW9State : StateBase<UserContext, InternalContext>
    {
        private readonly IW9GenerationService w9Generator;
        private readonly IDocumentStore documentStore;
        private ILogger logger;

        public GenerateW9State(IW9GenerationService w9Generator, IDocumentStore documentStore, ILogger logger)
            : base(previousState: typeof(PlaceOrderState), nextState: typeof(OrderConfirmationState))
        {
            this.w9Generator = w9Generator;
            this.documentStore = documentStore;
            this.logger = logger;
        }

        public override bool IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, UserContext context, InternalContext internalContext)
        {
            if (context.IsRenewal || context.IsAddLine)
            {
                if (validationResult.MemberNames.Any(m => m.StartsWith("ContactInfo")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("Language")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("SecondaryContactInfo")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("SocialSecurityNumber")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("DriversLicense")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("MailingAddress")))
                    return true;
            }
            if (context.IsRenewal || context.IsAddLine || context.IsSinglePage || context.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType == EnrollmentCustomerType.Commercial))
            {
                if (validationResult.MemberNames.Any(m => m.StartsWith("OnlineAccount")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("SelectedIdentityAnswers")))
                    return true;
            }
            if (context.IsRenewal || context.IsAddLine || context.IsSinglePage || !context.Services.SelectMany(svc => svc.Location.Capabilities).OfType<ServiceStatusCapability>().Any(cap => cap.EnrollmentType == EnrollmentType.MoveIn) || !context.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType != EnrollmentCustomerType.Commercial))
            {
                if (validationResult.MemberNames.Any(m => m.StartsWith("PreviousAddress")))
                    return true;
            }
            return base.IgnoreValidation(validationResult, context, internalContext);
        }

        protected override async Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            try
            {
                var accountNumber = internalContext.PlaceOrderResult.Where(p => p.Location.Capabilities.OfType<Mobile.ServiceCapability>().Any())
                    .Select(p => p.Details.ConfirmationNumber).FirstOrDefault();

                var w9Pdf = w9Generator.GenerateW9(context.W9BusinessData.BusinessInformationName, 
                    context.W9BusinessData.BusinessName, 
                    context.W9BusinessData.BusinessTaxClassification, 
                    context.W9BusinessData.AdditionalTaxClassification, 
                    context.W9BusinessData.ExemptCode, 
                    context.W9BusinessData.FatcaCode, 
                    context.W9BusinessData.BusinessAddressSame ? context.MailingAddress : context.W9BusinessData.BusinessAddress, 
                    context.W9BusinessData.CurrentAccountNumbers, 
                    context.SocialSecurityNumber, 
                    context.TaxId, 
                    context.W9BusinessData.SignatureImage, 
                    DateTime.Now);
                internalContext.W9StorageId = await documentStore.UploadNew(w9Pdf, internalContext.GlobalCustomerId, accountNumber, DocumentTypeIndicator.W9, "application/pdf");
            }
            catch (Exception ex)
            {
                logger.Record("Failed to generate W-9", ex, Severity.Error).Wait();
            }

            return await base.InternalProcess(context, internalContext);
        }
    }
}
