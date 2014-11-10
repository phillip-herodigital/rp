using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Data.MobileEnrollment
{
    public class DataContext : DbContext
    {
        public DataContext()
            : base("mobileEnroll")
        {
        }

        public virtual DbSet<EnrollmentRecord> EnrollmentRecords { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Properties<Guid>().Where(p => p.Name == "Id").Configure(c => c.HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity));
            modelBuilder.ComplexType<DomainModels.Address>();
            modelBuilder.ComplexType<DomainModels.Name>();
            modelBuilder.ComplexType<DomainModels.TypedPhone>();
            modelBuilder.ComplexType<DomainModels.Email>();

            modelBuilder.Entity<EnrollmentRecord>();
        }
    }
}
