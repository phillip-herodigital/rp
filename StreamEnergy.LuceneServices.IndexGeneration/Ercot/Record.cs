using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CsvHelper;

namespace StreamEnergy.LuceneServices.IndexGeneration.Ercot
{
    public class Record
    {
        /// <summary>
        /// The Electric Service Industry Identifier (ESI ID) as assigned by the TDSP        
        /// </summary>
        public string EsiId { get; set; }

        /// <summary>
        /// Registered Street Address
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// Address Overflow information - if necessary
        /// </summary>
        public string AddressOverflow { get; set; }

        /// <summary>
        /// Registered City
        /// </summary>
        public string City { get; set; }

        /// <summary>
        /// Registered State
        /// </summary>
        public string State { get; set; }

        /// <summary>
        /// Registered Zip Code
        /// </summary>
        public string Zipcode { get; set; }

        /// <summary>
        /// The Duns number assigned to the Market Participant
        /// </summary>
        public string Duns { get; set; }

        /// <summary>
        /// TDSPs/MREs have meter read cycles and this code represents a particular meter read date range in their systems ex: 03  
        /// </summary>
        public string MeterReadCycle { get; set; }

        /// <summary>
        /// Denotes the status of the ESI ID ex: Active, Inactive, De-energized
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// Denotes the type of premise as either Residential, Small Non-Residential, or Large Non-Residential
        /// </summary>
        public string PremiseType { get; set; }

        /// <summary>
        /// The character code identifying the power region the ESI ID is electrically connected in as assigned by the TDSP (ERCOT, SPP, SERC, WSCC)
        /// </summary>
        public string PowerRegion { get; set; }

        /// <summary>
        /// The unique character code to identify a substation serving an ESI ID as assigned by the TDSP and used in the ERCOT Network Model
        /// </summary>
        public string Stationcode { get; set; }

        /// <summary>
        /// The long name to identify a substation used in the ERCOT Network Model
        /// </summary>
        public string Stationname { get; set; }

        /// <summary>
        /// The derivation of the PROFILETYPE of the PROFILECODE. If the PROFILETYPE is = NM, the data would show N for not metered. If the PROFILETYPE is <> NM, the data would show Y for metered
        /// </summary>
        public string Metered { get; set; }

        /// <summary>
        /// Concatenation of all pending service orders by pipe ( | ) that includes the service order type and scheduled date ex: 07/07/2008,Move In|,Move Out to CSA
        /// </summary>
        public string OpenServiceOrders { get; set; }

        /// <summary>
        /// Calculated POLR Customer class assignment by ERCOT ex: Residential, Small Non-Residential, Medium Non-Residential, Large Non-Residential
        /// </summary>
        public string PolrCustomerClass { get; set; }

        /// <summary>
        /// The flag to identify whether an ESIID has an Advanced meter installed at the premise, (Advanced Meter = ‘Y’, Not an Advanced Meter = ‘N’).
        /// </summary>
        public string SettlementAmsIndicator { get; set; }

        /// <summary>
        /// Indicates the ESIID has a provisioned AMS meter.  AMSM = TDSP provisioned AMS meter without remote connect and disconnect capability, AMSR = TDSP provisioned AMS meter with remote connect and disconnect capability. NULL = either a Non AMS meter, a non-provisioned AMS meter or unmetered.
        /// </summary>
        public string TdspAmsIndicator { get; set; }

        /// <summary>
        /// The indicator to identify if there are Switch Holds present at ERCOT .''Y''=Switch Hold present,''N''= No Switch Hold present
        /// </summary>
        public string SwitchHoldIndictor { get; set; }
    }
}
