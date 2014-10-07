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
                    { Enrollments.TexasElectricity.ServiceCapability.Qualifier, typeof(Enrollments.TexasElectricity.ServiceCapability) },
                    { Enrollments.GeorgiaGas.ServiceCapability.Qualifier, typeof(Enrollments.GeorgiaGas.ServiceCapability) },
                    { Enrollments.ServiceStatusCapability.Qualifier, typeof(Enrollments.ServiceStatusCapability) },
                    { Enrollments.CustomerTypeCapability.Qualifier, typeof(Enrollments.CustomerTypeCapability) },
                }
            });

            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new TypeIndicatorLookup<Enrollments.IOfferOption, Enrollments.SampleOfferOption>(sc => sc.OptionType)
            {
                SupportedTypes = {
                    { Enrollments.TexasElectricity.OfferOption.Qualifier, typeof(Enrollments.TexasElectricity.OfferOption) },
                    { Enrollments.TexasElectricity.MoveInOfferOption.Qualifier, typeof(Enrollments.TexasElectricity.MoveInOfferOption) },
                    { Enrollments.TexasElectricity.CommercialQuoteOptionRules.Qualifier, typeof(Enrollments.TexasElectricity.CommercialQuoteOption) },
                    { Enrollments.GeorgiaGas.OfferOption.Qualifier, typeof(Enrollments.GeorgiaGas.OfferOption) },
                    { Enrollments.GeorgiaGas.MoveInOfferOption.Qualifier, typeof(Enrollments.GeorgiaGas.OfferOption) },
                    { Enrollments.GeorgiaGas.CommercialQuoteOptionRules.Qualifier, typeof(Enrollments.TexasElectricity.CommercialQuoteOption) },
                    { Enrollments.Renewal.OfferOption.Qualifier, typeof(Enrollments.Renewal.OfferOption) },
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
                    { Accounts.GeorgiaGasAccount.Qualifier, typeof(Accounts.GeorgiaGasAccount) }
                }
            };
            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(subAccountLookup);
            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new AccountLookup(subAccountLookup.SupportedTypes));

            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new TypeIndicatorLookup<Accounts.IAccountCapability, Accounts.SampleAccountCapability>(sc => sc.CapabilityType)
            {
                SupportedTypes = {
                    { Accounts.InvoiceExtensionAccountCapability.Qualifier, typeof(Accounts.InvoiceExtensionAccountCapability) },
                    { Accounts.ExternalPaymentAccountCapability.Qualifier, typeof(Accounts.ExternalPaymentAccountCapability) },
                    { Accounts.PaymentMethodAccountCapability.Qualifier, typeof(Accounts.PaymentMethodAccountCapability) },
                    { Accounts.PaymentSchedulingAccountCapability.Qualifier, typeof(Accounts.PaymentSchedulingAccountCapability) },
                    { Accounts.RenewalAccountCapability.Qualifier, typeof(Accounts.RenewalAccountCapability) },
                }
            });

            unityContainer.RegisterType<Accounts.ICurrentUser, Accounts.CurrentUser>(new ContainerControlledLifetimeManager());
        }
    }
}
