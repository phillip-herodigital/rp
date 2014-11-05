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
                        Name_First = c.String(nullable: false),
                        Name_Last = c.String(nullable: false),
                        Phone_Category = c.Int(nullable: false),
                        Phone_Number = c.String(nullable: false),
                        Email_Address = c.String(nullable: false),
                        BillingAddress_Line1 = c.String(nullable: false),
                        BillingAddress_Line2 = c.String(),
                        BillingAddress_UnitNumber = c.String(),
                        BillingAddress_City = c.String(nullable: false),
                        BillingAddress_StateAbbreviation = c.String(nullable: false),
                        BillingAddress_PostalCode5 = c.String(nullable: false),
                        BillingAddress_PostalCodePlus4 = c.String(),
                        ShippingAddress_Line1 = c.String(nullable: false),
                        ShippingAddress_Line2 = c.String(),
                        ShippingAddress_UnitNumber = c.String(),
                        ShippingAddress_City = c.String(nullable: false),
                        ShippingAddress_StateAbbreviation = c.String(nullable: false),
                        ShippingAddress_PostalCode5 = c.String(nullable: false),
                        ShippingAddress_PostalCodePlus4 = c.String(),
                        BusinessAddress_Line1 = c.String(nullable: false),
                        BusinessAddress_Line2 = c.String(),
                        BusinessAddress_UnitNumber = c.String(),
                        BusinessAddress_City = c.String(nullable: false),
                        BusinessAddress_StateAbbreviation = c.String(nullable: false),
                        BusinessAddress_PostalCode5 = c.String(nullable: false),
                        BusinessAddress_PostalCodePlus4 = c.String(),
                        BusinessInformationName = c.String(nullable: false),
                        BusinessName = c.String(),
                        TaxClassification = c.String(nullable: false),
                        ExemptCode = c.String(nullable: false),
                        FatcaCode = c.String(nullable: false),
                        BusinessAddressSame = c.Boolean(nullable: false),
                        CurrentAccountNumbers = c.String(),
                        CustomerCertification = c.DateTimeOffset(nullable: false, precision: 7),
                        CustomerSignature = c.String(nullable: false),
                        SignatureConfirmation = c.Boolean(nullable: false),
                        SignatoryName = c.String(nullable: false),
                        SignatoryRelation = c.String(nullable: false),
                        AgreeToTerms = c.DateTimeOffset(nullable: false, precision: 7),
                        TcpaPreference = c.Boolean(nullable: false),
                        PdfGen = c.Binary(),
                        AssociateId = c.String(),
                        SourceId = c.String(),
                        OrderId = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.EnrollmentRecords");
        }
    }
}
