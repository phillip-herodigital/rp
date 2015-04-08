using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public enum VerifyEsnResponseCode
    {
        Success,
        UnknownError,
        DoesNotExistInDatabase,
        DeviceUnavailable,
        FailedToRetrieve,
        InvalidEsnMeid,
        DeviceStolenOrLost,
        DeviceFraud,
        EsnInUse,
        InvalidReseller,
        BacksideConnectionFailed,
        XsdSchemaErrors,
        UnableToUpdate,
        ModelOrManufacturerUnknown,
        InvalidDeviceType,
        DeviceLocked,
        BadFinancialStanding,
    }
}
