using System;
using System.Collections.Generic;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class SupportFeedbackResponse
    {
        public bool Success { get; set; }
        public List<String> Validations { get; set; }
    }
}