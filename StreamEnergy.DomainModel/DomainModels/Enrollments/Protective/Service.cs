using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace StreamEnergy.DomainModels.Enrollments.Protective
{
    public class Service
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Guid { get; set; }
        public string Description { get; set; }
        public IEnumerable<string> ExcludedStates { get; set; }
        public IEnumerable<string> VideoConferenceStates { get; set; }
        public float Price { get; set; }
        public float ThreeServiceDiscount { get; set; }
        public string IconURL { get; set; }
        public IEnumerable<string> Details { get; set; }
        public int SortOrder { get; set; }
        public bool IsGroupOffer { get; set; }
        public bool HasGroupOffer { get; set; }
        public string AssociatedOfferId { get; set; }
    }
}
