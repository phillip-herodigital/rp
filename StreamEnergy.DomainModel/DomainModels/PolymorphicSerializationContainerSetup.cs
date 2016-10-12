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
                    { Enrollments.TexasElectricity.RenewalCapability.Qualifier, typeof(Enrollments.TexasElectricity.RenewalCapability) },
                    { Enrollments.NewJerseyElectricity.ServiceCapability.Qualifier, typeof(Enrollments.NewJerseyElectricity.ServiceCapability) },
                    { Enrollments.NewJerseyElectricity.RenewalCapability.Qualifier, typeof(Enrollments.NewJerseyElectricity.RenewalCapability) },
                    { Enrollments.NewJerseyGas.ServiceCapability.Qualifier, typeof(Enrollments.NewJerseyGas.ServiceCapability) },
                    { Enrollments.NewJerseyGas.RenewalCapability.Qualifier, typeof(Enrollments.NewJerseyGas.RenewalCapability) },
                    { Enrollments.GeorgiaGas.ServiceCapability.Qualifier, typeof(Enrollments.GeorgiaGas.ServiceCapability) },
                    { Enrollments.Mobile.ServiceCapability.Qualifier, typeof(Enrollments.Mobile.ServiceCapability) },
                    { Enrollments.Protective.ServiceCapability.Qualifier, typeof(Enrollments.Protective.ServiceCapability) },
                    { Enrollments.GeorgiaGas.RenewalCapability.Qualifier, typeof(Enrollments.GeorgiaGas.RenewalCapability) },
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
                    { Enrollments.NewJerseyElectricity.OfferOption.Qualifier, typeof(Enrollments.NewJerseyElectricity.OfferOption) },
                    { Enrollments.NewJerseyElectricity.MoveInOfferOption.Qualifier, typeof(Enrollments.NewJerseyElectricity.MoveInOfferOption) },
                    { Enrollments.NewJerseyElectricity.SwitchOfferOption.Qualifier, typeof(Enrollments.NewJerseyElectricity.SwitchOfferOption) },
                    { Enrollments.NewJerseyElectricity.CommercialQuoteOptionRules.Qualifier, typeof(Enrollments.NewJerseyGas.CommercialQuoteOption) },
                    { Enrollments.NewJerseyGas.OfferOption.Qualifier, typeof(Enrollments.NewJerseyElectricity.OfferOption) },
                    { Enrollments.NewJerseyGas.MoveInOfferOption.Qualifier, typeof(Enrollments.NewJerseyGas.MoveInOfferOption) },
                    { Enrollments.NewJerseyGas.SwitchOfferOption.Qualifier, typeof(Enrollments.NewJerseyGas.SwitchOfferOption) },
                    { Enrollments.NewJerseyGas.CommercialQuoteOptionRules.Qualifier, typeof(Enrollments.NewJerseyGas.CommercialQuoteOption) },
                    { Enrollments.GeorgiaGas.SwitchOfferOption.Qualifier, typeof(Enrollments.GeorgiaGas.SwitchOfferOption) },
                    { Enrollments.GeorgiaGas.MoveInOfferOption.Qualifier, typeof(Enrollments.GeorgiaGas.MoveInOfferOption) },
                    { Enrollments.GeorgiaGas.RenewalOfferOption.Qualifier, typeof(Enrollments.GeorgiaGas.RenewalOfferOption) },
                    { Enrollments.GeorgiaGas.CommercialQuoteOptionRules.Qualifier, typeof(Enrollments.GeorgiaGas.CommercialQuoteOption) },
                    { Enrollments.Mobile.OfferOption.Qualifier, typeof(Enrollments.Mobile.OfferOption) },
                    { Enrollments.Protective.OfferOption.Qualifier, typeof(Enrollments.Protective.OfferOption) },
                }
            });

            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new TypeIndicatorLookup<Payments.IPaymentInfo, Payments.SamplePaymentInfo>(sc => sc.PaymentType)
            {
                SupportedTypes = {
                    { Payments.TokenizedCard.Qualifier, typeof(Payments.TokenizedCard) },
                    { Payments.TokenizedBank.Qualifier, typeof(Payments.TokenizedBank) },
                    { Payments.SavedPaymentInfo.Qualifier, typeof(Payments.SavedPaymentInfo) },
                }
            });

            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new PhoneSubtypeLookup());

            var subAccountLookup = new TypeIndicatorLookup<Accounts.ISubAccount, Accounts.SampleSubAccount>(sc => sc.SubAccountType)
            {
                SupportedTypes = {
                    { Accounts.TexasElectricityAccount.Qualifier, typeof(Accounts.TexasElectricityAccount) },
                    { Accounts.NewJerseyElectricityAccount.Qualifier, typeof(Accounts.NewJerseyElectricityAccount) },
                    { Accounts.NewJerseyGasAccount.Qualifier, typeof(Accounts.NewJerseyGasAccount) },
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
                }
            });

            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new TypeIndicatorLookup<Accounts.ISubAccountCapability, Accounts.SampleSubAccountCapability>(sc => sc.CapabilityType)
            {
                SupportedTypes = {
                    { Accounts.RenewalAccountCapability.Qualifier, typeof(Accounts.RenewalAccountCapability) },
                }
            });

            unityContainer.RegisterInstance<string>(Accounts.ImpersonationUtility.SharedSecretKey, System.Configuration.ConfigurationManager.AppSettings["Impersonation Shared Secret"] ?? Guid.NewGuid().ToString());
            unityContainer.RegisterType<Accounts.ICurrentUser, Accounts.CurrentUser>(new ContainerControlledLifetimeManager());
        }
    }
}
