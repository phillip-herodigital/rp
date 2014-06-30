using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Lucene.Net.Analysis;
using Lucene.Net.Analysis.Standard;

namespace StreamEnergy.LuceneServices.Web.Models
{
    public static class AddressConstants
    {
        public readonly static ReadOnlyCollection<string> StreetSuffixes = new[] 
        { 
            "ALY", "ANX", "ARC", "AVE", "BYU", "BCH", "BND", "BLF", "BLFS", "BTM", 
            "BLVD", "BR", "BRG", "BRK", "BRKS", "BG", "BGS", "BYP", "CP", "CYN", 
            "CPE", "CSWY", "CTR", "CTRS", "CIR", "CIRS", "CLF", "CLFS", "CLB", 
            "CMN", "COR", "CORS", "CRSE", "CT", "CTS", "CV", "CVS", "CRK", "CRES", 
            "CRST", "XING", "XRD", "CURV", "DL", "DM", "DV", "DR", "DRS", "EST", 
            "ESTS", "EXPY", "EXT", "EXTS", "FALL", "FLS", "FRY", "FLD", "FLDS", 
            "FLT", "FLTS", "FRD", "FRDS", "FRST", "FRG", "FRGS", "FRK", "FRKS", 
            "FT", "FWY", "GDN", "GDNS", "GTWY", "GLN", "GLNS", "GRN", "GRNS", 
            "GRV", "GRVS", "HBR", "HBRS", "HVN", "HTS", "HWY", "HL", "HLS", 
            "HOLW", "INLT", "IS", "ISS", "ISLE", "JCT", "JCTS", "KY", "KYS", 
            "KNL", "KNLS", "LK", "LKS", "LAND", "LNDG", "LN", "LGT", "LGTS", "LF",
            "LCK", "LCKS", "LDG", "LOOP", "MALL", "MNR", "MNRS", "MDW", "MDWS", 
            "MEWS", "ML", "MLS", "MSN", "MTWY", "MT", "MTN", "MTNS", "NCK", 
            "ORCH", "OVAL", "OPAS", "PARK", "PKWY", "PASS", "PSGE", "PATH", 
            "PIKE", "PNE", "PNES", "PL", "PLN", "PLNS", "PLZ", "PT", "PTS", "PRT",
            "PRTS", "PR", "RADL", "RAMP", "RNCH", "RPD", "RPDS", "RST", "RDG", 
            "RDGS", "RIV", "RD", "RDS", "RTE", "ROW", "RUE", "RUN", "SHL", "SHLS",
            "SHR", "SHRS", "SKWY", "SPG", "SPGS", "SPUR", "SQ", "SQS", "STA", 
            "STRA", "STRM", "STRM ", "ST", "STS", "SMT", "TER", "TRWY", "TRCE",
            "TRAK", "TRFY", "TRL", "TRL ", "TUNL", "TPKE", "UPAS", "UN", "UNS", 
            "VLY", "VLYS", "VIA", "VW", "VWS", "VLG", "VLGS", "VL", "VIS", "WALK",
            "WALL", "WAY", "WAYS", "WL", "WLS" 
        }.ToList().AsReadOnly();

        public static ReadOnlyCollection<string> SupportedStates = new[]
        {
            "TX", "GA", "PA", "MA", "NJ", "NY", "DC"
        }.ToList().AsReadOnly();

        public static ReadOnlyCollection<string> ApartmentPrefixes = new[]
        {
            "APT", "UNIT", "STE"
        }.ToList().AsReadOnly();

        public static Analyzer BuildLuceneAnalyzer()
        {
            // These are words that are "stopped" from being indexed - it's important that common words like "Dr", "St", "Rd", etc. are excluded or the index gets very slow when the user includes them in the search.
            var stopWords = new HashSet<string>(Enumerable.Empty<string>() 
                .Union(AddressConstants.StreetSuffixes)
                .Union(AddressConstants.SupportedStates)
                .Union(AddressConstants.ApartmentPrefixes)
                .Select(s => s.ToLower()));

            // We might be able to do better by combining some terms, like "Apt" with the number, or "E" and "RD" with the street names, etc.
            // This would require a custom analyzer, however.

            return new StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_30, stopWords);
        }
    }
}
