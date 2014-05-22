using Microsoft.Practices.Unity;
using StreamEnergy.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels
{
    class PolymorphicSerializationContainerSetup : IContainerSetupStrategy
    {
        void IContainerSetupStrategy.SetupUnity(IUnityContainer unityContainer)
        {
            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new TypeIndicatorLookup<IServiceCapability, SampleServiceCapability, TexasServiceCapability>
                {
                    IsMatch = serviceCapability => serviceCapability.CapabilityType == TexasServiceCapability.Qualifier
                });

            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new TypeIndicatorLookup<IServiceCapability, SampleServiceCapability, Enrollments.ServiceStatusCapability>
                {
                    IsMatch = serviceCapability => serviceCapability.CapabilityType == Enrollments.ServiceStatusCapability.Qualifier
                });

            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new TypeIndicatorLookup<Enrollments.IOfferOption, Enrollments.SampleOfferOption, Enrollments.TexasElectricityOfferOption>
                {
                    IsMatch = serviceCapability => serviceCapability.OptionType == Enrollments.TexasElectricityOfferOption.Qualifier
                });

            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new TypeIndicatorLookup<Payments.IPaymentInfo, Payments.SamplePaymentInfo, Payments.TokenizedCard>
                {
                    IsMatch = serviceCapability => serviceCapability.PaymentType == Payments.TokenizedCard.Qualifier
                });
        }
    }
}
