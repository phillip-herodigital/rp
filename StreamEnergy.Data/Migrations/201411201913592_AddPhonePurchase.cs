namespace StreamEnergy.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddPhonePurchase : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.EnrollmentRecords", "Network", c => c.String(maxLength: 256));
            AddColumn("dbo.EnrollmentRecords", "NewDeviceSku", c => c.String(maxLength: 256));
            AddColumn("dbo.EnrollmentRecords", "BuyingOption", c => c.String(maxLength: 256));
            AddColumn("dbo.EnrollmentRecords", "Price", c => c.String(maxLength: 256));
            AddColumn("dbo.EnrollmentRecords", "Warranty", c => c.String(maxLength: 256));
        }
        
        public override void Down()
        {
            DropColumn("dbo.EnrollmentRecords", "Warranty");
            DropColumn("dbo.EnrollmentRecords", "Price");
            DropColumn("dbo.EnrollmentRecords", "BuyingOption");
            DropColumn("dbo.EnrollmentRecords", "NewDeviceSku");
            DropColumn("dbo.EnrollmentRecords", "Network");
        }
    }
}
