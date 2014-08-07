using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using StackExchange.Redis;

namespace StreamEnergy.RenderingService
{
    class Program
    {
        static void Main(string[] args)
        {
            Uri baseUri = new Uri("http://localhost:59203/");
            if (args.Length == 0)
            {
                TaskScheduler.UnobservedTaskException += (sender, e) =>
                {
                    e.SetObserved();
                };
                ServiceBase.Run(new ScreenshotListeningService(baseUri));
            }
            else
            {
                new ScreenshotListeningService(baseUri).StartMainLoop().Wait();
            }

            //var result = Task.Delay(1000).ContinueWith(async delegate
            //{
            //    await redisDb.ListRightPushAsync("EnrollmentScreenshots", @"{""validations"":[],""expectedState"":""orderConfirmed"",""cart"":[{""location"":{""address"":{""line1"":""3620 Huffines Blvd"",""unitNumber"":""226"",""city"":""Carrollton"",""stateAbbreviation"":""TX"",""postalCode5"":""75010""},""capabilities"":[{""capabilityType"":""TexasElectricity"",""esiId"":""1234SAMPLE5678"",""tdu"":""Centerpoint"",""meterType"":""notMetered""}]},""offerInformationByType"":[{""key"":""TexasElectricity"",""value"":{""availableOffers"":[{""id"":""24-month-fixed-rate"",""offerType"":""TexasElectricity"",""rateType"":""fixed"",""rate"":0.0,""cancellationFee"":0.0,""termMonths"":0},{""id"":""Month-to-month"",""offerType"":""TexasElectricity"",""rateType"":""fixed"",""rate"":0.0,""cancellationFee"":0.0,""termMonths"":1}],""offerSelections"":[{""offerId"":""24-month-fixed-rate"",""optionRules"":{""optionRulesType"":""TexasElectricity"",""connectDates"":{}},""offerOption"":{""connectDate"":""2014-05-01T00:00:00"",""optionType"":""TexasElectricity""},""payments"":{""requiredAmounts"":[{""offerPaymentAmountType"":""Deposit"",""dollarAmount"":0.0,""isDollarAmountEstimated"":false}],""ongoingAmounts"":[]},""confirmationNumber"":""87654321""}],""errors"":[]}}]}],""identityQuestions"":[{""questionId"":""1"",""questionText"":""What is your name?"",""answers"":[{""answerId"":""1"",""answerText"":""King Arthur""},{""answerId"":""2"",""answerText"":""Sir Lancelot""},{""answerId"":""3"",""answerText"":""Sir Robin""},{""answerId"":""4"",""answerText"":""Sir Galahad""}]},{""questionId"":""2"",""questionText"":""What is your quest?"",""answers"":[{""answerId"":""1"",""answerText"":""To seek the Holy Grail.""}]},{""questionId"":""3"",""questionText"":""What is your favorite color?"",""answers"":[{""answerId"":""1"",""answerText"":""Blue.""},{""answerId"":""2"",""answerText"":""Green.""},{""answerId"":""3"",""answerText"":""Yellow.""},{""answerId"":""4"",""answerText"":""Red.""}]}],""isRenewal"":true}");
            //}).ContinueWith(delegate { return Task.Delay(10000); }).ContinueWith(async delegate
            //{
            //    await redisDb.ListRightPushAsync("EnrollmentScreenshots", @"{""validations"":[],""expectedState"":""orderConfirmed"",""cart"":[{""location"":{""address"":{""line1"":""3620 Huffines Blvd"",""unitNumber"":""226"",""city"":""Carrollton"",""stateAbbreviation"":""TX"",""postalCode5"":""75010""},""capabilities"":[{""capabilityType"":""TexasElectricity"",""esiId"":""1234SAMPLE5678"",""tdu"":""Centerpoint"",""meterType"":""notMetered""}]},""offerInformationByType"":[{""key"":""TexasElectricity"",""value"":{""availableOffers"":[{""id"":""24-month-fixed-rate"",""offerType"":""TexasElectricity"",""rateType"":""fixed"",""rate"":0.0,""cancellationFee"":0.0,""termMonths"":0},{""id"":""Month-to-month"",""offerType"":""TexasElectricity"",""rateType"":""fixed"",""rate"":0.0,""cancellationFee"":0.0,""termMonths"":1}],""offerSelections"":[{""offerId"":""24-month-fixed-rate"",""optionRules"":{""optionRulesType"":""TexasElectricity"",""connectDates"":{}},""offerOption"":{""connectDate"":""2014-05-01T00:00:00"",""optionType"":""TexasElectricity""},""payments"":{""requiredAmounts"":[{""offerPaymentAmountType"":""Deposit"",""dollarAmount"":0.0,""isDollarAmountEstimated"":false}],""ongoingAmounts"":[]},""confirmationNumber"":""87654321""}],""errors"":[]}}]}],""identityQuestions"":[{""questionId"":""1"",""questionText"":""What is your name?"",""answers"":[{""answerId"":""1"",""answerText"":""King Arthur""},{""answerId"":""2"",""answerText"":""Sir Lancelot""},{""answerId"":""3"",""answerText"":""Sir Robin""},{""answerId"":""4"",""answerText"":""Sir Galahad""}]},{""questionId"":""2"",""questionText"":""What is your quest?"",""answers"":[{""answerId"":""1"",""answerText"":""To seek the Holy Grail.""}]},{""questionId"":""3"",""questionText"":""What is your favorite color?"",""answers"":[{""answerId"":""1"",""answerText"":""Blue.""},{""answerId"":""2"",""answerText"":""Green.""},{""answerId"":""3"",""answerText"":""Yellow.""},{""answerId"":""4"",""answerText"":""Red.""}]}],""isRenewal"":true}");
            //});
        }

    }
}
