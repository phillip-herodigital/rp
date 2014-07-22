using StreamEnergy.DomainModels.Enrollments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients
{
    class EnrollmentService : IEnrollmentService
    {
        // TODO - replace with actual implementations
        [Serializable]
        class ConnectDatePolicy : IConnectDatePolicy
        {

        }

        Dictionary<Location, LocationOfferSet> IEnrollmentService.LoadOffers(IEnumerable<Location> serviceLocations)
        {
            return serviceLocations.ToDictionary(location => location, location =>
            {
                if (location.Capabilities.OfType<DomainModels.TexasServiceCapability>().Count() > 1)
                {
                    return new LocationOfferSet { OfferSetErrors = { { "TexasElectricity", "MultipleTdu" } } };
                }
                var offers = new IOffer[] 
                {
                    new TexasElectricityOffer
                    {
                        Id = "24-month-fixed-rate",
                        Name= "24 Month Fixed Rate",
                        RateType= DomainModels.Enrollments.RateType.Fixed,
                        Rate= 7.18m,
                        TermMonths= 24,
                        CancellationFee=150,
                        Description = "When it comes to your family's energy service, you can't afford to compromise. You need assurances that your electric and gas rates are competitive and that your energy provider truly cares when you need help or have a question. You can rest easy, because Stream Energy, a leader among power companies in the United States, is here for you. We are pleased to offer our customers a variety of choices in their selection of their energy services.",
                        Documents = new Dictionary<string,Uri> 
                        {
                            { "ElectricityFactsLabel", new Uri("/", UriKind.Relative) },
                            { "TermsOfService", new Uri("/", UriKind.Relative) },
                            { "YourRightsAsACustomer", new Uri("/", UriKind.Relative) },
                        }
                    },
                    new TexasElectricityOffer
                    {
                        Id="6-month-fixed-rate",
                        Name="6 Month Fixed Rate",
                        RateType= DomainModels.Enrollments.RateType.Fixed,
                        Rate=7.98m,
                        TermMonths=6,
                        CancellationFee=150,
                        Description="When it comes to your family's energy service, you can't afford to compromise. You need assurances that your electric and gas rates are competitive and that your energy provider truly cares when you need help or have a question. You can rest easy, because Stream Energy, a leader among power companies in the United States, is here for you. We are pleased to offer our customers a variety of choices in their selection of their energy services.",
                        Documents = new Dictionary<string,Uri> 
                        {
                            { "ElectricityFactsLabel", new Uri("/", UriKind.Relative) },
                            { "TermsOfService", new Uri("/", UriKind.Relative) },
                            { "YourRightsAsACustomer", new Uri("/", UriKind.Relative) },
                        }
                    },
                    new TexasElectricityOffer
                    {
                        Id="month-to-month-rate",
                        Name="Month-To-Month Rate",
                        RateType= DomainModels.Enrollments.RateType.Variable,
                        Rate=7.98m,
                        TermMonths=1,
                        CancellationFee=0,
                        Description="When it comes to your family's energy service, you can't afford to compromise. You need assurances that your electric and gas rates are competitive and that your energy provider truly cares when you need help or have a question. You can rest easy, because Stream Energy, a leader among power companies in the United States, is here for you. We are pleased to offer our customers a variety of choices in their selection of their energy services.",
                        Documents = new Dictionary<string,Uri> 
                        {
                            { "ElectricityFactsLabel", new Uri("/", UriKind.Relative) },
                            { "TermsOfService", new Uri("/", UriKind.Relative) },
                            { "YourRightsAsACustomer", new Uri("/", UriKind.Relative) },
                        }
                    },
                    new TexasElectricityOffer
                    {
                        Id="introductory-rate-plan",
                        Name="Introductory Rate Plan",
                        RateType= DomainModels.Enrollments.RateType.Variable,
                        Rate=8.08m,
                        TermMonths=1,
                        CancellationFee=0,
                        Description="When it comes to your family's energy service, you can't afford to compromise. You need assurances that your electric and gas rates are competitive and that your energy provider truly cares when you need help or have a question. You can rest easy, because Stream Energy, a leader among power companies in the United States, is here for you. We are pleased to offer our customers a variety of choices in their selection of their energy services.",
                        Documents = new Dictionary<string,Uri> 
                        {
                            { "ElectricityFactsLabel", new Uri("/", UriKind.Relative) },
                            { "TermsOfService", new Uri("/", UriKind.Relative) },
                            { "YourRightsAsACustomer", new Uri("/", UriKind.Relative) },
                        }
                    }
                };

                return new LocationOfferSet { Offers = offers.ToArray() };
            });
        }

        IConnectDatePolicy IEnrollmentService.LoadConnectDates(Location location)
        {
            return new ConnectDatePolicy();
        }

        DomainModels.Enrollments.Service.IdentityCheckResult IEnrollmentService.IdentityCheck(DomainModels.Name name, string ssn, DomainModels.DriversLicense driversLicense, AdditionalIdentityInformation identityInformation)
        {
            if (identityInformation == null)
            {
                return new DomainModels.Enrollments.Service.IdentityCheckResult
                {
                    IdentityAccepted = false,
                    HardStop = null,
                    IdentityCheckId = "01234",
                    IdentityQuestions = new[] 
                    {
                        new IdentityQuestion
                        {
                            QuestionId = "1",
                            QuestionText = "What is your name?",
                            Answers = new[] { 
                                new IdentityAnswer { AnswerId = "1", AnswerText = "King Arthur" },
                                new IdentityAnswer { AnswerId = "2", AnswerText = "Sir Lancelot" },
                                new IdentityAnswer { AnswerId = "3", AnswerText = "Sir Robin" },
                                new IdentityAnswer { AnswerId = "4", AnswerText = "Sir Galahad" },
                            }
                        },
                        new IdentityQuestion
                        {
                            QuestionId = "2",
                            QuestionText = "What is your quest?",
                            Answers = new[] { 
                                new IdentityAnswer { AnswerId = "1", AnswerText = "To seek the Holy Grail." },
                            }
                        },
                        new IdentityQuestion
                        {
                            QuestionId = "3",
                            QuestionText = "What is your favorite color?",
                            Answers = new[] { 
                                new IdentityAnswer { AnswerId = "1", AnswerText = "Blue." },
                                new IdentityAnswer { AnswerId = "2", AnswerText = "Green." },
                                new IdentityAnswer { AnswerId = "3", AnswerText = "Yellow." },
                                new IdentityAnswer { AnswerId = "4", AnswerText = "Red." },
                            }
                        },
                    }
                };
            }
            else
            {
                return new DomainModels.Enrollments.Service.IdentityCheckResult
                {
                    IdentityCheckId = "01235",
                    IdentityAccepted = true,
                    HardStop = null,
                    IdentityQuestions = new IdentityQuestion[0],
                };
            }
        }

        IEnumerable<DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.OfferPayment>> IEnrollmentService.LoadOfferPayments(IEnumerable<LocationServices> services)
        {
            return (from loc in services
                    from offer in loc.SelectedOffers
                    select new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.OfferPayment>
                    {
                        Location = loc.Location,
                        Offer = offer.Offer,
                        Details = new DomainModels.Enrollments.OfferPayment
                        {
                            RequiredAmounts = new IOfferPaymentAmount[] 
                            { 
                                new DepositOfferPaymentAmount { DollarAmount = (offer.Offer is TexasElectricityOffer && ((TexasElectricityOffer)offer.Offer).TermMonths == 1) ? 0 : 75.25m }
                            },
                            OngoingAmounts = new IOfferPaymentAmount[] { }
                        }
                    }).ToArray();
        }

        IEnumerable<DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.Service.PlaceOrderResult>> IEnrollmentService.PlaceOrder(IEnumerable<LocationServices> services)
        {

            return (from loc in services
                    from offer in loc.SelectedOffers
                    select new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.Service.PlaceOrderResult>
                    {
                        Location = loc.Location,
                        Offer = offer.Offer,
                        Details = new DomainModels.Enrollments.Service.PlaceOrderResult { ConfirmationNumber = "87654321" }
                    }).ToArray();
        }

    }
}
