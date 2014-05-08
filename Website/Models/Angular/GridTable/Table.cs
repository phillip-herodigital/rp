using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Angular.GridTable
{
    public class Table<TRow>
    {
        public IEnumerable<Column> ColumnList { get; set; }
        public IEnumerable<TRow> Values { get; set; }

    }
}