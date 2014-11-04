namespace StreamEnergy.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using StreamEnergy.Data.MobileEnrollment;

    internal sealed class Configuration : DbMigrationsConfiguration<DataContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;            
        }

        protected override void Seed(DataContext context)
        {
            // create initial values
        }
    }
}
