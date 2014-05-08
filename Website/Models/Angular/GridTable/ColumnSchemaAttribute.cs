using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Angular.GridTable
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple=false)]
    public class ColumnSchemaAttribute : Attribute
    {
        public ColumnSchemaAttribute(string displayNameField, params DeviceType[] hideFor)
        {
            DisplayNameField = displayNameField;
            HideFor = hideFor;
            IsVisible = true;
        }

        public bool IsVisible { get; set; }

        public string DisplayNameField { get; private set; }

        public DeviceType[] HideFor { get; private set; }
    }
}