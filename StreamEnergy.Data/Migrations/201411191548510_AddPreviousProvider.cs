namespace StreamEnergy.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddPreviousProvider : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.EnrollmentRecords", "PreviousServiceProvider", c => c.String(maxLength: 256));
        }
        
        public override void Down()
        {
            DropColumn("dbo.EnrollmentRecords", "PreviousServiceProvider");
        }
    }
}
