using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class AnsweredSecurityQuestion
    {
        public SecurityQuestion SelectedQuestion { get; set; }
        public string Answer { get; set; }
    }
}
