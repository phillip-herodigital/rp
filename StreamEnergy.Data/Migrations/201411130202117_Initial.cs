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
                        Name_First = c.String(nullable: false, maxLength: 256),
                        Name_Last = c.String(nullable: false, maxLength: 256),
                        Phone_Category = c.Int(nullable: false),
                        Phone_Number = c.String(nullable: false, maxLength: 256),
                        Email_Address = c.String(nullable: false, maxLength: 256),
                        BillingAddress_Line1 = c.String(nullable: false, maxLength: 256),
                        BillingAddress_Line2 = c.String(maxLength: 256),
                        BillingAddress_UnitNumber = c.String(maxLength: 256),
                        BillingAddress_City = c.String(nullable: false, maxLength: 256),
                        BillingAddress_StateAbbreviation = c.String(nullable: false, maxLength: 256),
                        BillingAddress_PostalCode5 = c.String(nullable: false, maxLength: 256),
                        BillingAddress_PostalCodePlus4 = c.String(maxLength: 256),
                        BusinessAddressSame = c.Boolean(nullable: false),
                        ShippingAddress_Line1 = c.String(nullable: false, maxLength: 256),
                        ShippingAddress_Line2 = c.String(maxLength: 256),
                        ShippingAddress_UnitNumber = c.String(maxLength: 256),
                        ShippingAddress_City = c.String(nullable: false, maxLength: 256),
                        ShippingAddress_StateAbbreviation = c.String(nullable: false, maxLength: 256),
                        ShippingAddress_PostalCode5 = c.String(nullable: false, maxLength: 256),
                        ShippingAddress_PostalCodePlus4 = c.String(maxLength: 256),
                        ShippingAddressSame = c.Boolean(nullable: false),
                        BusinessAddress_Line1 = c.String(nullable: false, maxLength: 256),
                        BusinessAddress_Line2 = c.String(maxLength: 256),
                        BusinessAddress_UnitNumber = c.String(maxLength: 256),
                        BusinessAddress_City = c.String(nullable: false, maxLength: 256),
                        BusinessAddress_StateAbbreviation = c.String(nullable: false, maxLength: 256),
                        BusinessAddress_PostalCode5 = c.String(nullable: false, maxLength: 256),
                        BusinessAddress_PostalCodePlus4 = c.String(maxLength: 256),
                        BusinessInformationName = c.String(nullable: false, maxLength: 256),
                        BusinessName = c.String(maxLength: 256),
                        TaxClassification = c.Int(nullable: false),
                        AdditionalTaxClassification = c.String(maxLength: 256),
                        ExemptCode = c.String(maxLength: 256),
                        FatcaCode = c.String(maxLength: 256),
                        CurrentAccountNumbers = c.String(maxLength: 256),
                        SocialSecurityNumber = c.String(maxLength: 256),
                        TaxId = c.String(maxLength: 256),
                        CustomerCertification = c.DateTimeOffset(nullable: false, precision: 7),
                        CustomerSignature = c.String(nullable: false, maxLength: 256),
                        SignatureImage = c.Binary(),
                        SignatureConfirmation = c.Boolean(nullable: false),
                        SignatoryName = c.String(maxLength: 256),
                        SignatoryRelation = c.String(maxLength: 256),
                        AgreeToTerms = c.DateTimeOffset(nullable: false, precision: 7),
                        TcpaPreference = c.Boolean(nullable: false),
                        PdfGen = c.Binary(),
                        AssociateId = c.String(maxLength: 256),
                        SourceId = c.String(maxLength: 256),
                        OrderId = c.String(maxLength: 256),
                        DeviceMake = c.String(maxLength: 256),
                        DeviceModel = c.String(maxLength: 256),
                        DeviceSerial = c.String(maxLength: 256),
                        SimNumber = c.String(maxLength: 256),
                        NewNumber = c.String(maxLength: 256),
                        PortInNumber = c.String(maxLength: 256),
                        PlanId = c.String(maxLength: 256),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.EnrollmentRecords");
        }
    }
}
