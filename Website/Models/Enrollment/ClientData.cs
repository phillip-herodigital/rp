using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class ClientData
    {
        public IEnumerable<TranslatedValidationResult> Validations { get; set; }
        public DomainModels.Enrollments.UserContext UserContext { get; set; }
        public Dictionary<string, IEnumerable<DomainModels.Enrollments.IOffer>> Offers { get; set; }
        public Dictionary<string, Dictionary<string, DomainModels.Enrollments.IOfferOptionRules>> OfferOptionRules { get; set; }
        public DomainModels.Enrollments.IdentityQuestion[] IdentityQuestions { get; set; }
        public decimal? DepositAmount { get; set; }
        public string ConfirmationNumber { get; set; }
    }
}