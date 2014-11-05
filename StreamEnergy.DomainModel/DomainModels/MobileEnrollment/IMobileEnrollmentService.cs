using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.MobileEnrollment
{
    public interface IMobileEnrollmentService
    {
        Task<bool> RecordEnrollment(UserContext data);
    }
}
