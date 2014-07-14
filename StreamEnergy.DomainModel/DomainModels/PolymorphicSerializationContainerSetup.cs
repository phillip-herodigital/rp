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
            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new TypeIndicatorLookup<IServiceCapability, SampleServiceCapability>(sc => sc.CapabilityType)
            {
                SupportedTypes = {
                    { TexasServiceCapability.Qualifier, typeof(TexasServiceCapability) },
                    { Enrollments.ServiceStatusCapability.Qualifier, typeof(Enrollments.ServiceStatusCapability) }
                }
            });

            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new TypeIndicatorLookup<Enrollments.IOfferOption, Enrollments.SampleOfferOption>(sc => sc.OptionType)
            {
                SupportedTypes = {
                    { Enrollments.TexasElectricityOfferOption.Qualifier, typeof(Enrollments.TexasElectricityOfferOption) }
                }
            });

            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new TypeIndicatorLookup<Payments.IPaymentInfo, Payments.SamplePaymentInfo>(sc => sc.PaymentType)
            {
                SupportedTypes = {
                    { Payments.TokenizedCard.Qualifier, typeof(Payments.TokenizedCard) },
                    { Payments.BankPaymentInfo.Qualifier, typeof(Payments.BankPaymentInfo) },
                    { Payments.SavedPaymentInfo.Qualifier, typeof(Payments.SavedPaymentInfo) },
                }
            });

            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new PhoneSubtypeLookup());

            var subAccountLookup = new TypeIndicatorLookup<Accounts.ISubAccount, Accounts.SampleSubAccount>(sc => sc.SubAccountType)
            {
                SupportedTypes = {
                    { Accounts.TexasElectricityAccount.Qualifier, typeof(Accounts.TexasElectricityAccount) },
                    { Accounts.GeorgiaElectricityAccount.Qualifier, typeof(Accounts.GeorgiaElectricityAccount) }
                }
            };
            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(subAccountLookup);
            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new AccountLookup(subAccountLookup.SupportedTypes));

            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new TypeIndicatorLookup<Accounts.IAccountCapability, Accounts.SampleAccountCapability>(sc => sc.CapabilityType)
            {
                SupportedTypes = {
                    { Accounts.InvoiceExtensionAccountCapability.Qualifier, typeof(Accounts.InvoiceExtensionAccountCapability) }
                }
            });

        }
    }
}
