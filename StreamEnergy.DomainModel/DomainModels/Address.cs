using StreamEnergy.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels
{
    [Serializable]
    [System.Web.Mvc.ModelBinder(typeof(Mvc.IgnoreBlanksModelBinder))]
    [System.Diagnostics.DebuggerDisplay("{ToSingleLine()}")]
    public class Address : ISanitizable, IEquatable<Address>
    {
        [Required(ErrorMessage = "Line 1 Required")]
        public string Line1 { get; set; }

        public string Line2 { get; set; }
        public string UnitNumber { get; set; }

        [Required(ErrorMessage = "City Required")]
        public string City { get; set; }

        [Required(ErrorMessage = "State Required")]
        public string StateAbbreviation { get; set; }

        [Required(ErrorMessage = "Postal Code Required")]
        [RegularExpression("^[0-9]{5}$", ErrorMessage = "Postal Code Invalid")]
        public string PostalCode5 { get; set; }

        [RegularExpression("^[0-9]{4}$", ErrorMessage = "Postal Code Plus 4 Invalid")]
        public string PostalCodePlus4 { get; set; }

        void ISanitizable.Sanitize()
        {
            if (Line1 != null)
                Line1 = Line1.Trim();

            if (Line2 != null)
                Line2 = Line2.Trim();

            if (UnitNumber != null)
                UnitNumber = UnitNumber.Trim();

            if (City != null)
                City = City.Trim();

            if (StateAbbreviation != null)
                StateAbbreviation = StateAbbreviation.Trim();

            if (PostalCode5 != null)
                PostalCode5 = PostalCode5.Trim();

            if (PostalCodePlus4 != null)
                PostalCodePlus4 = PostalCodePlus4.Trim();
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            return Equals((Address)obj);
        }

        public override int GetHashCode()
        {
            return string.Join("|"
                , this.City ?? ""
                , this.Line1 ?? ""
                , this.Line2 ?? ""
                , this.PostalCode5 ?? ""
                , this.PostalCodePlus4 ?? ""
                , this.StateAbbreviation ?? ""
                , this.UnitNumber ?? "").GetHashCode();
        }

        public bool Equals(Address other)
        {
            return (this.City ?? "").ToLower() == (other.City ?? "").ToLower()
                && (this.Line1 ?? "").ToLower() == (other.Line1 ?? "").ToLower()
                && (this.Line2 ?? "").ToLower() == (other.Line2 ?? "").ToLower()
                && (this.PostalCode5 ?? "").ToLower() == (other.PostalCode5 ?? "").ToLower()
                && (this.PostalCodePlus4 ?? "").ToLower() == (other.PostalCodePlus4 ?? "").ToLower()
                && (this.StateAbbreviation ?? "").ToLower() == (other.StateAbbreviation ?? "").ToLower()
                && (this.UnitNumber ?? "").ToLower() == (other.UnitNumber ?? "").ToLower();
        }

        public static bool operator ==(Address lhs, Address rhs)
        {
            if (object.ReferenceEquals(lhs, null) && object.ReferenceEquals(rhs, null))
            {
                return true;
            }
            else if (object.ReferenceEquals(lhs, null) || object.ReferenceEquals(rhs, null))
            {
                return false;
            }

            return lhs.Equals(rhs);
        }

        public static bool operator !=(Address lhs, Address rhs)
        {
            return !(lhs == rhs);
        }

        public string ToSingleLine()
        {
            if (string.IsNullOrEmpty(Line1) && string.IsNullOrEmpty(Line2) && string.IsNullOrEmpty(UnitNumber) && string.IsNullOrEmpty(City))
                return (PostalCode5.Prefix(" ") + PostalCodePlus4.Prefix("-")).Trim();
            return (Line1 + Line2.Prefix(" ") + UnitNumber.Prefix(" ") + " " + City + ", " + StateAbbreviation + "," + PostalCode5.Prefix(" ") + PostalCodePlus4.Prefix("-")).Trim();
        }
    }
}
