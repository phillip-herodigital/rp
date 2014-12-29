﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.Service
{
    [Serializable]
    public class EnrollmentSaveEntry
    {
        public string EnrollmentAccountKeyJson { get; set; }
        public Guid GlobalEnrollmentAccountId { get; set; }
    }
}
