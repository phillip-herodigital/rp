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
                    { Enrollments.GeorgiaGas.ServiceCapability.Qualifier, typeof(Enrollments.GeorgiaGas.ServiceCapability) },
                    { Enrollments.GeorgiaGas.RenewalCapability.Qualifier, typeof(Enrollments.GeorgiaGas.RenewalCapability) },
                    { Enrollments.NewJerseyElectricity.ServiceCapability.Qualifier, typeof(Enrollments.NewJerseyElectricity.ServiceCapability) },
                    { Enrollments.NewJerseyElectricity.RenewalCapability.Qualifier, typeof(Enrollments.NewJerseyElectricity.RenewalCapability) },
                    { Enrollments.NewJerseyGas.ServiceCapability.Qualifier, typeof(Enrollments.NewJerseyGas.ServiceCapability) },
                    { Enrollments.NewJerseyGas.RenewalCapability.Qualifier, typeof(Enrollments.NewJerseyGas.RenewalCapability) },
                    { Enrollments.NewYorkElectricity.ServiceCapability.Qualifier, typeof(Enrollments.NewYorkElectricity.ServiceCapability) },
                    { Enrollments.NewYorkElectricity.RenewalCapability.Qualifier, typeof(Enrollments.NewYorkElectricity.RenewalCapability) },
                    { Enrollments.DCElectricity.ServiceCapability.Qualifier, typeof(Enrollments.DCElectricity.ServiceCapability) },
                    { Enrollments.DCElectricity.RenewalCapability.Qualifier, typeof(Enrollments.DCElectricity.RenewalCapability) },
                    { Enrollments.MarylandGas.ServiceCapability.Qualifier, typeof(Enrollments.MarylandGas.ServiceCapability) },
                    { Enrollments.MarylandGas.RenewalCapability.Qualifier, typeof(Enrollments.MarylandGas.RenewalCapability) },
                    { Enrollments.MarylandElectricity.ServiceCapability.Qualifier, typeof(Enrollments.MarylandElectricity.ServiceCapability) },
                    { Enrollments.MarylandElectricity.RenewalCapability.Qualifier, typeof(Enrollments.MarylandElectricity.RenewalCapability) },
                    { Enrollments.PennsylvaniaGas.ServiceCapability.Qualifier, typeof(Enrollments.PennsylvaniaGas.ServiceCapability) },
                    { Enrollments.PennsylvaniaGas.RenewalCapability.Qualifier, typeof(Enrollments.PennsylvaniaGas.RenewalCapability) },
                    { Enrollments.PennsylvaniaElectricity.ServiceCapability.Qualifier, typeof(Enrollments.PennsylvaniaElectricity.ServiceCapability) },
                    { Enrollments.PennsylvaniaElectricity.RenewalCapability.Qualifier, typeof(Enrollments.PennsylvaniaElectricity.RenewalCapability) },
                    { Enrollments.Mobile.ServiceCapability.Qualifier, typeof(Enrollments.Mobile.ServiceCapability) },
                    { Enrollments.Protective.ServiceCapability.Qualifier, typeof(Enrollments.Protective.ServiceCapability) },
                    { Enrollments.ServiceStatusCapability.Qualifier, typeof(Enrollments.ServiceStatusCapability) },
                    { Enrollments.CustomerTypeCapability.Qualifier, typeof(Enrollments.CustomerTypeCapability) },
                }
            });

            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new TypeIndicatorLookup<Enrollments.IOfferOption, Enrollments.SampleOfferOption>(sc => sc.OptionType)
            {
                SupportedTypes = {
                    { Enrollments.TexasElectricity.OfferOption.Qualifier, typeof(Enrollments.TexasElectricity.OfferOption) },
                    { Enrollments.TexasElectricity.MoveInOfferOption.Qualifier, typeof(Enrollments.TexasElectricity.MoveInOfferOption) },
                    { Enrollments.TexasElectricity.CommercialQuoteOption.Qualifier, typeof(Enrollments.TexasElectricity.CommercialQuoteOption) },
                    { Enrollments.NewJerseyElectricity.SwitchOfferOption.Qualifier, typeof(Enrollments.NewJerseyElectricity.SwitchOfferOption) },
                    { Enrollments.NewJerseyElectricity.RenewalOfferOption.Qualifier, typeof(Enrollments.NewJerseyElectricity.RenewalOfferOption) },
                    { Enrollments.NewJerseyElectricity.CommercialQuoteOptionRules.Qualifier, typeof(Enrollments.NewJerseyElectricity.CommercialQuoteOption) },
                    { Enrollments.DCElectricity.SwitchOfferOption.Qualifier, typeof(Enrollments.DCElectricity.SwitchOfferOption) },
                    { Enrollments.DCElectricity.RenewalOfferOption.Qualifier, typeof(Enrollments.DCElectricity.RenewalOfferOption) },
                    { Enrollments.DCElectricity.CommercialQuoteOptionRules.Qualifier, typeof(Enrollments.DCElectricity.CommercialQuoteOption) },
                    { Enrollments.MarylandElectricity.SwitchOfferOption.Qualifier, typeof(Enrollments.MarylandElectricity.SwitchOfferOption) },
                    { Enrollments.MarylandElectricity.RenewalOfferOption.Qualifier, typeof(Enrollments.MarylandElectricity.RenewalOfferOption) },
                    { Enrollments.MarylandElectricity.CommercialQuoteOptionRules.Qualifier, typeof(Enrollments.MarylandElectricity.CommercialQuoteOption) },
                    { Enrollments.MarylandGas.SwitchOfferOption.Qualifier, typeof(Enrollments.MarylandGas.SwitchOfferOption) },
                    { Enrollments.MarylandGas.RenewalOfferOption.Qualifier, typeof(Enrollments.MarylandGas.RenewalOfferOption) },
                    { Enrollments.MarylandGas.CommercialQuoteOptionRules.Qualifier, typeof(Enrollments.MarylandGas.CommercialQuoteOption) },
                    { Enrollments.PennsylvaniaElectricity.SwitchOfferOption.Qualifier, typeof(Enrollments.PennsylvaniaElectricity.SwitchOfferOption) },
                    { Enrollments.PennsylvaniaElectricity.RenewalOfferOption.Qualifier, typeof(Enrollments.PennsylvaniaElectricity.RenewalOfferOption) },
                    { Enrollments.PennsylvaniaElectricity.CommercialQuoteOptionRules.Qualifier, typeof(Enrollments.PennsylvaniaElectricity.CommercialQuoteOption) },
                    { Enrollments.PennsylvaniaGas.SwitchOfferOption.Qualifier, typeof(Enrollments.PennsylvaniaGas.SwitchOfferOption) },
                    { Enrollments.PennsylvaniaGas.RenewalOfferOption.Qualifier, typeof(Enrollments.PennsylvaniaGas.RenewalOfferOption) },
                    { Enrollments.PennsylvaniaGas.CommercialQuoteOptionRules.Qualifier, typeof(Enrollments.PennsylvaniaGas.CommercialQuoteOption) },
                    { Enrollments.NewJerseyGas.SwitchOfferOption.Qualifier, typeof(Enrollments.NewJerseyGas.SwitchOfferOption) },
                    { Enrollments.NewJerseyGas.RenewalOfferOption.Qualifier, typeof(Enrollments.NewJerseyGas.RenewalOfferOption) },
                    { Enrollments.NewJerseyGas.CommercialQuoteOptionRules.Qualifier, typeof(Enrollments.NewJerseyGas.CommercialQuoteOption) },
                    { Enrollments.NewYorkElectricity.SwitchOfferOption.Qualifier, typeof(Enrollments.NewYorkElectricity.SwitchOfferOption) },
                    { Enrollments.NewYorkElectricity.RenewalOfferOption.Qualifier, typeof(Enrollments.NewYorkElectricity.RenewalOfferOption) },
                    { Enrollments.NewYorkElectricity.CommercialQuoteOptionRules.Qualifier, typeof(Enrollments.NewYorkElectricity.CommercialQuoteOption) },
                    { Enrollments.NewYorkGas.SwitchOfferOption.Qualifier, typeof(Enrollments.NewYorkGas.SwitchOfferOption) },
                    { Enrollments.NewYorkGas.RenewalOfferOption.Qualifier, typeof(Enrollments.NewYorkGas.RenewalOfferOption) },
                    { Enrollments.NewYorkGas.CommercialQuoteOptionRules.Qualifier, typeof(Enrollments.NewYorkGas.CommercialQuoteOption) },
                    { Enrollments.GeorgiaGas.SwitchOfferOption.Qualifier, typeof(Enrollments.GeorgiaGas.SwitchOfferOption) },
                    { Enrollments.GeorgiaGas.MoveInOfferOption.Qualifier, typeof(Enrollments.GeorgiaGas.MoveInOfferOption) },
                    { Enrollments.GeorgiaGas.RenewalOfferOption.Qualifier, typeof(Enrollments.GeorgiaGas.RenewalOfferOption) },
                    { Enrollments.GeorgiaGas.CommercialQuoteOption.Qualifier, typeof(Enrollments.GeorgiaGas.CommercialQuoteOption) },
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
                    { Accounts.GeorgiaGasAccount.Qualifier, typeof(Accounts.GeorgiaGasAccount) },
                    { Accounts.NewJerseyElectricityAccount.Qualifier, typeof(Accounts.NewJerseyElectricityAccount) },
                    { Accounts.DCElectricityAccount.Qualifier, typeof(Accounts.DCElectricityAccount) },
                    { Accounts.NewJerseyGasAccount.Qualifier, typeof(Accounts.NewJerseyGasAccount) },
                    { Accounts.NewYorkElectricityAccount.Qualifier, typeof(Accounts.NewYorkElectricityAccount) },
                    { Accounts.NewYorkGasAccount.Qualifier, typeof(Accounts.NewYorkGasAccount) },
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
