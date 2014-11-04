namespace StreamEnergy.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.EnrollmentRecords",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        State = c.String(),
                        PlanId = c.String(),
                        PlanTitle = c.String(),
                        Imei = c.String(),
                        Esn = c.String(),
                        Sim = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.EnrollmentRecords");
        }
    }
}
