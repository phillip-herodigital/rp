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

        IEnumerable<Tuple<Location, IOffer>> IEnrollmentService.LoadOffers(IEnumerable<Location> serviceLocations)
        {
            return serviceLocations.SelectMany(location =>
            {
                return new [] 
                { 
                    Tuple.Create(location, (IOffer)new TexasElectricityOffer
                        {
                            Id = "NewOffer"
                        })
                };
            }).ToArray();
        }

        IConnectDatePolicy IEnrollmentService.LoadConnectDates(Location location)
        {
            return new ConnectDatePolicy();
        }

        DomainModels.Enrollments.Service.IdentityCheckResult IEnrollmentService.IdentityCheck(DomainModels.Name name, string ssn, DomainModels.DriversLicense driversLicense, DomainModels.Address billingAddress, AdditionalIdentityInformation identityInformation)
        {
            if (identityInformation == null)
            {
                return new DomainModels.Enrollments.Service.IdentityCheckResult
                {
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
                    HardStop = null,
                    IdentityQuestions = new IdentityQuestion[0],
                };
            }
        }

        DomainModels.Enrollments.Service.LoadDepositResult IEnrollmentService.LoadDeposit(IEnumerable<LocationServices> services)
        {
            return new DomainModels.Enrollments.Service.LoadDepositResult
            {
                Amount = 50.00m
            };
        }

        DomainModels.Enrollments.Service.PlaceOrderResult IEnrollmentService.PlaceOrder(IEnumerable<LocationServices> services)
        {
            return new DomainModels.Enrollments.Service.PlaceOrderResult { ConfirmationNumber = "87654321" };
        }

    }
}
