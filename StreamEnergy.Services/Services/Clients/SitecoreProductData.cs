using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace StreamEnergy.Services.Clients
{
    class SitecoreProductData : ISitecoreProductData
    {
        private Sitecore.Data.Items.Item taxonomy;

        public SitecoreProductData([Dependency("Taxonomy")] Sitecore.Data.Items.Item taxonomy)
        {
            this.taxonomy = taxonomy;
        }



        public SitecoreProductInfo GetTexasElectricityProductData(string productCode, string providerName)
        {

            if (taxonomy != null)
            {
                var item = taxonomy.Axes.GetItem("Products/*/" + productCode);

                if (item != null)
                {
                    Sitecore.Data.Items.Item providerData = providerName != null ? item.Axes.GetChild(providerName.ToString()) : null;

                    if (providerData != null)
                    {
                        return new SitecoreProductInfo
                        {
                            Fields = new NameValueCollection
                            {
                                { "Name", item["Product Name"] },
                                { "Description", LoadProductDescription(providerName, item) },
                                { "Minimum Usage Fee", item["Minimum Usage Fee"] },
                                { "TDU Charges", item["TDU Charges"] },
                                { "Energy Facts Label", (providerData != null) ? ((Sitecore.Data.Fields.FileField)providerData.Fields["Energy Facts Label"]).Src : null },
                                { "Terms Of Service", (providerData != null) ? ((Sitecore.Data.Fields.FileField)providerData.Fields["Terms Of Service"]).Src : null },
                                { "Your Rights As A Customer", (providerData != null) ? ((Sitecore.Data.Fields.FileField)providerData.Fields["Your Rights As A Customer"]).Src : null },
                            },
                            Footnotes = LoadFootnotes(new[] { item, providerData }, new[] { "Rate Footnote", "Term Footnote", "Early Termination Fee Footnote" }).ToArray()
                        };
                    }
                }
            }

            return null;
        }

        private string LoadProductDescription(string providerName, Sitecore.Data.Items.Item item)
        {
            var desc = item["Product Description"];
            var tdu = providerName.Replace(" ", "");
            var rateTiers = Sitecore.Web.WebUtil.ParseUrlParameters(item["Rate Tiers"]);

            foreach(var key in rateTiers.AllKeys)
            {
                if (key.StartsWith(tdu))
                {
                    desc = desc.Replace("{" + key.Replace(tdu, "") + "}", rateTiers[key]);
                }
            }
            return desc;
        }

        public SitecoreProductInfo GetGeorgiaGasProductData(string productCode)
        {

            if (taxonomy != null && !string.IsNullOrEmpty(productCode))
            {
                var item = taxonomy.Axes.GetItem("Products/*/" + productCode);

                if (item != null)
                {
                    return new SitecoreProductInfo
                    {
                        Fields = new NameValueCollection
                        {
                            { "Name", item["Product Name"] },
                            { "Description", item["Product Description"] },
                            { "Monthly Service Charge", item["Monthly Service Charge"] },
                            { "Early Termination Fee", item["Early Termination Fee"] },
                            { "Letter of Agency", ((Sitecore.Data.Fields.FileField)item.Fields["Letter of Agency"]).Src },
                            { "Terms and Disclosures", ((Sitecore.Data.Fields.FileField)item.Fields["Terms and Disclosures"]).Src },
                        },
                        Footnotes = LoadFootnotes(new[] { item }, new[] { "Rate Footnote", "Term Footnote", "Early Termination Fee Footnote" }).ToArray()
                    };
                }
            }

            return null;
        }

        private IEnumerable<KeyValuePair<string, string>> LoadFootnotes(Sitecore.Data.Items.Item[] items, string[] fieldNames)
        {
            foreach (var fieldName in fieldNames)
            {
                foreach (var item in items.Reverse())
                {
                    var value = item[fieldName];
                    if (!string.IsNullOrEmpty(value))
                    {
                        yield return new KeyValuePair<string, string>(fieldName, value);
                        break;
                    }
                }
            }
        }


        public SitecoreProductInfo GetMobileProductData(string productId)
        {
            if (taxonomy != null && !string.IsNullOrEmpty(productId))
            {
                var item = taxonomy.Axes.GetItem("Modules/Mobile/Mobile Data Plans/*/" + productId);

                if (item != null)
                {
                    return new SitecoreProductInfo
                    {
                        Fields = new NameValueCollection
                        {
                            { "Name", item["Product Name"] },
                            { "Data", item["Data"] },
                            { "Hours Music", item["Data"] == "Unlimited"? "30+" : (Convert.ToInt32(item["Data"]) * 6).ToString() },
                            { "Hours Movies", item["Data"] == "Unlimited"? "10+" : (Convert.ToInt32(item["Data"]) * 2).ToString() },
                            { "Web Pages", item["Data"] == "Unlimited"? "1500+" : (Convert.ToInt32(item["Data"]) * 300).ToString() },
                            { "Recommended", item["Recommended"] },
                            { "Special Offer", item["Special Offer"] },
                            { "Special Offer Text", item["Special Offer Text"] },
                            { "Special Offer Original Price", item["Special Offer Original Price"] },
                            { "Hide Plan", item["Hide Plan"] },
                            { "non-LTE Plan", item["non-LTE Plan"] },
                        },
                        Footnotes = new KeyValuePair<string, string>[0]
                    };
                }
            }

            return null;

        }

        public SitecoreProductInfo GetMobileInventoryData(string inventoryId)
        {
            if (taxonomy != null && !string.IsNullOrEmpty(inventoryId))
            {
                var item = taxonomy.Axes.GetItem("Modules/Mobile/Mobile Pricing/*/" + inventoryId);

                if (item != null)
                {
                    var installmentChild = item.Children.FirstOrDefault();
                    return new SitecoreProductInfo
                    {
                        Fields = new NameValueCollection
                        {
                            { "SKU", item["SKU"] },
                            { "Installment Months", installmentChild == null ? null : installmentChild.Fields["Number of Months"].Value },
                            { "A Group SKU", installmentChild == null ? null : installmentChild.Fields["A Group SKU"].Value },
                            { "B Group SKU", installmentChild == null ? null : installmentChild.Fields["B Group SKU"].Value },
                            { "C Group SKU", installmentChild == null ? null : installmentChild.Fields["C Group SKU"].Value },
                        },
                        Footnotes = new KeyValuePair<string, string>[0]
                    };
                }
            }

            return null;
            
        }

    }
}
