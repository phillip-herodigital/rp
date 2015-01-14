using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Documents;
using StreamEnergy.DomainModels.MobileEnrollment;
using StreamEnergy.Processes;

namespace StreamEnergy.DomainModels.Enrollments
{
    class GenerateW9State : StateBase<UserContext, InternalContext>
    {
        private readonly IW9GenerationService w9Generator;
        //private readonly IDocumentStore documentStore;

        public GenerateW9State(IW9GenerationService w9Generator)
            : base(previousState: typeof(PlaceOrderState), nextState: typeof(OrderConfirmationState))
        {
            this.w9Generator = w9Generator;
            //this.documentStore = documentStore;
        }

        protected override async Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            var w9Pdf = w9Generator.GenerateW9(context.W9BusinessData.BusinessInformationName, context.W9BusinessData.BusinessName, context.W9BusinessData.BusinessTaxClassification, context.W9BusinessData.AdditionalTaxClassification, context.W9BusinessData.ExemptCode, context.W9BusinessData.FatcaCode, context.W9BusinessData.BusinessAddress, context.W9BusinessData.CurrentAccountNumbers, context.SocialSecurityNumber, context.TaxId, context.W9BusinessData.SignatureImage, DateTime.Now);
            //internalContext.W9StorageId = await documentStore.UploadNew(w9Pdf, internalContext.GlobalCustomerId, DocumentTypeIndicator.W9, "application/pdf");

            if (internalContext.PlaceOrderAsyncResult != null)
                return typeof(AsyncPlaceOrderState);
            return await base.InternalProcess(context, internalContext);
        }
    }
}
