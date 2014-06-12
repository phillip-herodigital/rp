using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class Location : ISanitizable
    {
        [Required(ErrorMessage = "Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Address ")]
        public Address Address { get; set; }

        [Required(ErrorMessage = "Capabilities Missing")]
        [EnumerableRequired(ErrorMessage = "Capabilities Missing")]
        [ValidateEnumerable(ErrorMessagePrefix = "Capabilities ")]
        public IEnumerable<IServiceCapability> Capabilities { get; set; }


        void ISanitizable.Sanitize()
        {
            if (Address != null)
                ((ISanitizable)Address).Sanitize();
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            return Address.Equals(((Location)obj).Address) && Capabilities.OrderBy(c => c.GetHashCode()).SequenceEqual(((Location)obj).Capabilities.OrderBy(c => c.GetHashCode()));
        }

        public override int GetHashCode()
        {
            return Capabilities.Aggregate(Address.GetHashCode(), (currentHash, serviceCapability) => serviceCapability.GetHashCode() ^ currentHash);
        }

        public static bool operator==(Location lhs, Location rhs)
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

        public static bool operator!=(Location lhs, Location rhs)
        {
            return !(lhs == rhs);
        }
    }
}
