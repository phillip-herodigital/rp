using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.LuceneServices.IndexGeneration.Ercot
{
    public class FileMetadata
    {
        public DateTime Date { get; set; }

        public string Tdu { get; set; }

        public bool IsFull { get; set; }

        public string FullPath { get; set; }
    }
}
