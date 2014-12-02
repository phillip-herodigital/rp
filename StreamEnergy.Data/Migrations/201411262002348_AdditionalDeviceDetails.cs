namespace StreamEnergy.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AdditionalDeviceDetails : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.EnrollmentRecords", "DeviceColor", c => c.String(maxLength: 256));
            AddColumn("dbo.EnrollmentRecords", "DeviceSize", c => c.String(maxLength: 256));
        }
        
        public override void Down()
        {
            DropColumn("dbo.EnrollmentRecords", "DeviceSize");
            DropColumn("dbo.EnrollmentRecords", "DeviceColor");
        }
    }
}
